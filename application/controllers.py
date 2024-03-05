from flask import current_app as app, jsonify, request, render_template,flash
from flask_security import auth_required, roles_required, login_required,current_user,login_user,logout_user
from werkzeug.security import check_password_hash,generate_password_hash
from flask_restful import marshal, fields
from .models import User, Role,db,Song
from .security import datastore
import secrets
import re
import os
from .tasks import say_hello


@app.get('/')
def home():
    return render_template('index.html')

@app.get('/admin')
@auth_required('token')
@roles_required('Administrator')
def admin():
    return "Welcome Sukuna"

@app.get('/activate/ctor/<int:creator_id>')
@auth_required('token')
@roles_required('Administrator')
def activate_creator(creator_id):
    creator = User.query.get(creator_id)
    if not creator or 'Creator' not in creator.roles:
        return jsonify({"message":"Creator not found"}),404
    
    creator.active = True
    db.session.commit()
    return jsonify({"message":"User activated"})

@app.post('/user_register')
def user_register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    repeat_pass = data.get('repeatPassword')
    creatorCheck = data.get('creatorCheck')

    errors = []

    if not username:
        errors.append("Username is required.")
    
    if not email:
        errors.append("Email is required.")
    elif not is_valid_email(email):
        errors.append("Please enter a valid email address.")
    
    if not password:
        errors.append("Password is required.")
    
    if not repeat_pass:
        errors.append("Repeat Password is required.")
    elif repeat_pass != password:
        errors.append("Passwords do not match.")
    
    if errors:
        return jsonify({'message': ', '.join(errors)}), 400
    if not datastore.find_user(username=username,email=email,active=False):
        if creatorCheck: 
            datastore.create_user(username=username,email=email,password=generate_password_hash(password),roles=["Creator"],active=False)
            db.session.commit()
            return jsonify({"message":"Creator registered Successfully"}),200
        else:  
            datastore.create_user(username=username,email=email,password=generate_password_hash(password),roles=["User"],active=True)
            db.session.commit()
            return jsonify({"message":"User registered Successfully"}),200
    else:
        return jsonify({"message":"User or Creator with this account information already exists, try logging in"})


def is_valid_email(email):
    # Simple email validation regex
    
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'
    return re.match(email_regex, email)


@app.post('/user_login')
def user_login():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message":"Email required"}), 400
    
    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"message":"User not found"}),404
    if check_password_hash(user.password,data.get("password")):
        if user.roles[0].name == "Creator":
            login_user(user)
            user_songs = Song.query.filter_by(creator=user)
            return jsonify({"token":user.get_auth_token(),
                            "role" : user.roles[0].name,
                            "username":user.username,   
                            "id":user.id}),200
        else:
            login_user(user)
            return jsonify({"token":user.get_auth_token(),
                            "message":"Welcome User "+user.username,
                            "role" : user.roles[0].name,
                            "username":user.username,
                            "id":user.id}),200
    else:
        return jsonify({"message":"Wrong Password"}), 404
        
@app.route('/admin_login',methods=['GET','POST'])
def admin_dashboard():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message":"Admin Email is required"}),400
    
    admin = datastore.find_user(email=email)
    if not admin:
        return jsonify({"message":"Pass the correct admin credentials"}),404
    if admin:
        login_user(admin)
        if admin.active:
            if check_password_hash(admin.password,data.get('password')):
                if admin.roles[0].name == "Administrator":
                    return jsonify({"token":admin.get_auth_token(),
                            "role" : admin.roles[0].name,
                            "username":admin.username}),200
        else:
            return jsonify({"message":"Cannot access admin"}),400

def savingSongLocally(upSong):
    random_hex = secrets.token_hex(8)
    name,extension = os.path.splitext(upSong.filename)
    songFile = random_hex + extension
    path = os.path.join(app.root_path,'static/trackfiles',songFile)
    upSong.save(path)
    return songFile

def deletingSongFromLocal(song):
    file_path = os.path.join(app.root_path,'static/trackfiles',song)
    if os.path.isfile(file_path):
        os.remove(file_path)
    else:
        return jsonify({"message":"File not found"}),404
    
def savingPosterLocally(poster):
    random_hex = secrets.token_hex(8)
    name,extension = os.path.splitext(poster.filename)
    posterFile = random_hex + extension
    path = os.path.join(app.root_path, 'static/posterfiles',posterFile)
    poster.save(path)
    return posterFile

def deletingPosterFromLocal(poster):
    file_path = os.path.join(app.root_path,'static/posterfiles',poster)
    if os.path.isfile(file_path):
        os.remove(file_path)
    else:
        return jsonify({"message":"File not found"}),404
    
def savingCoverLocally(cover):
    random_hex = secrets.token_hex(8)
    name,extension = os.path.splitext(cover.filename)
    coverFile = random_hex + extension
    path = os.path.join(app.root_path, 'static/album_cover',coverFile)
    cover.save(path)
    return coverFile

def deletingCoverFromLocal(cover):
    file_path = os.path.join(app.root_path,'static/album_cover',cover)
    if os.path.isfile(file_path):
        os.remove(file_path)
    else:
        return jsonify({"message":"File not found"}),404


@app.route('/upload_song',methods=['POST','GET'])
def uploadSong():
    song_name = request.form.get('name')
    song_duration = request.form.get('duration')
    custom_release_date = request.form.get('releaseDate')
    genre = request.form.get('genre')
    creator_id = request.form.get('creator_id')
    lyrics = request.form.get('lyrics')
    creator = User.query.get(creator_id)

    # Access the file using request.files
    songfile = request.files.get('songfile')
    poster = request.files.get('posterfile')

    if not song_name:
            return jsonify({"message":"Mention the name of the song to upload"})
    if not song_duration:
            return jsonify({"message":"Mention the track duration"})
    if creator:
        if creator.roles[0].name == 'Creator':
            if songfile and poster:
                songUrl = savingSongLocally(songfile)
                posterUrl = savingPosterLocally(poster)
                song = Song(name=song_name,lyrics=lyrics,genre=genre,duration=song_duration,date_created=custom_release_date,creator=creator,songUrl=songUrl,poster=posterUrl)
            else:
                song = Song(name=song_name,lyrics=lyrics,genre=genre,duration=song_duration,date_created=custom_release_date,creator=creator)
        db.session.add(song)
        db.session.commit()
        return jsonify({"message":"Song Uploaded Successfully"})
    
@app.route('/delete_song/<int:id>')
def deleteSong(id):
    selected_song = Song.query.filter_by(id=id).first()
   #current user check needs to be implemented
    if selected_song:
        db.session.delete(selected_song)
        deletingSongFromLocal(selected_song.songUrl)
        deletingPosterFromLocal(selected_song.poster)
        db.session.commit()
        return jsonify({"message":"Song deleted Successfully"})
    return jsonify({"message":"Couldn't delete song"})

@app.route('/updateSong/<name>')
def updateSong(name):
    selected_song = Song.query.filter_by(name=name).first()
    pass


user_fields = {

    "id":fields.Integer,
    "email":fields.String, 
    "username":fields.String,
    "active":fields.Boolean,
    "roles":fields.String,

}

songs_fields = {

    "id":fields.Integer,
    "name":fields.String,
    "lyrics":fields.String,
    "genre":fields.String,
    "duration":fields.String,
    "songUrl":fields.String,
    "poster":fields.String,
    "date_created":fields.String,

}


@app.get('/all_users')
@auth_required('token')
@roles_required('Administrator')
def allUsers():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message":"No users found"}),404
    return marshal(users,user_fields)

@app.route('/people_to_follow/<int:id>',methods=['GET','POST'])
def people_to_follow(id):
    user = datastore.find_user(id=id)
    if 'User' in user.roles:
        all_users = User.query.all()

        return marshal(all_users,user_fields)
    return jsonify({"message":"No user found to follow"})

@app.route('/account_page/<int:id>/<username>')
def account(id,username):
    user = datastore.find_user(id=id)
    if 'User' in user.roles:
        return jsonify({"message":user.username})
    if 'Creator' in user.roles:
        songs_of_creator = Song.query.filter_by(creator=user).all()
        return marshal(songs_of_creator,songs_fields)

@app.route('/song_fetcher/<username>')
@login_required
def fetchSongs(username):
    user = User.query.filter_by(username=username).first()
    if user is None:
        return jsonify({"message":"No user"})
    if user == current_user:
        followed_songs = user.followed_songs()
        return marshal(followed_songs,songs_fields)



@app.get('/creator_songs/<int:id>')
def allSongs(id):
    creator = User.query.get(id)
    if creator:
        songs = Song.query.filter_by(creator=creator).all()
    if songs:
        return marshal(songs,songs_fields)
    return jsonify({"message":"No songs yet"})


@app.route('/follow/<username>')
@login_required
def follow(username):
    user_to_follow = User.query.filter_by(username=username).first()
    if user_to_follow is None:
        return jsonify({"message":"User not found" })
    if user_to_follow == current_user:
        return jsonify({"message":"You cannot follow yourself, We appreciate the self love"})
    current_user.follow(user_to_follow)
    db.session.commit()
    return jsonify({"message":"You are now following this user!" })

@app.route('/unfollow/<username>')
@login_required
def unfollow(username):
    user_to_unfollow = User.query.filter_by(username=username).first()
    if user_to_unfollow is None:
        return jsonify({"message":"User not found" })
    if user_to_unfollow == current_user:
        return jsonify({"message":"You cannot unfollow yourself" })
    current_user.unfollow(user_to_unfollow)
    db.session.commit()
    return jsonify({"message":"You don't follow this user anymore" })
    

@app.route('/logout')
def logout():
    logout_user()
    return jsonify({"message":"User logged out succesfully"})


@app.route('/say_hello')
def say_hello_view():
    t = say_hello.delay()
    return jsonify({"task_id":t.id})