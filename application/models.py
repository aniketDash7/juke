from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
import datetime
db = SQLAlchemy()

followers = db.Table(
    'followers',
    db.Column('follower_id',db.Integer,db.ForeignKey('user.id')),
    db.Column('followed_id',db.Integer,db.ForeignKey('user.id'))
)  


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=False)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean())
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))
    songs = db.relationship('Song', backref='creator')
    likes = db.relationship('Like',backref='creator')
    followed = db.relationship(
            'User', secondary=followers,
            primaryjoin=(followers.c.follower_id == id),
            secondaryjoin=(followers.c.followed_id == id),
            backref=db.backref('followers', lazy='dynamic'), lazy='dynamic')


    def __repr__(self):
        return f"User('{self.username}')"

    def follow(self,user):
        if not self.is_following(user):
            self.followed.append(user)
    
    def unfollow(self,user):
        if self.is_following(user):
            self.followed.remove(user)
        
    def is_following(self,user):
        return self.followed.filter(
            followers.c.followed_id == user.id
        ).count() > 0

    def followed_songs(self):
        followed = Song.query.join(
            followers, (followers.c.followed_id == Song.creator_id)
            ).filter(followers.c.follower_id == self.id)
        ogfeed = Song.query.filter_by(creator_id=self.id)
        return followed.union(ogfeed).order_by(Song.date_created.desc())
    

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

class Song(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String,unique=False,nullable=False)
    lyrics = db.Column(db.Text,nullable=True)
    genre = db.Column(db.String,nullable=True)
    songUrl = db.Column(db.String(20))
    duration = db.Column(db.String,nullable=False)
    poster = db.Column(db.String(20), nullable=False, default='default.png')
    creator_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    likes = db.relationship('Like', backref='song')
    date_created = db.Column(db.String,default=datetime.datetime.utcnow,nullable=False)
    def __repr__(self):
        return f"Song ('{self.name}', '{self.date_created}')"


class Album(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    song_id = db.Column('song_id',db.Integer(),db.ForeignKey('song.id'))
    #creator_id = db.Column(db.Integer(),db.ForeignKey('user.id'),nullable=False)
    likes = db.Column(db.Integer,default=0)
    cover = db.Column(db.String(20), nullable=False, default='default.png')
    name = db.Column(db.String(50),nullable=False,unique=True)
    date_created = db.Column(db.String,default=datetime.datetime.utcnow,nullable=False)


class Like(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    user_id = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    song_id = db.Column(db.Integer,db.ForeignKey('song.id'),nullable=False)
    album_id = db.Column(db.Integer,db.ForeignKey('album.id'),nullable=False)


