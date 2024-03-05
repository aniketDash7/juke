from flask_restful import Resource, Api, reqparse, marshal_with, fields, marshal
from flask_security import auth_required, roles_required, current_user
from .models import Song, db

api = Api(prefix='/api')
parser = reqparse.RequestParser()

parser.add_argument('name', type=str,help='Pass in the name of the song',required=True)
parser.add_argument('lyrics', type=str,help='Lyrics should be a string',required=True)
parser.add_argument('genre', type=str,help='Pass in the genre of the song',required=True)

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


class SongsAPI(Resource):
    @auth_required('token')
    def get(self):
        if "User" in current_user.roles or "Administrator" in current_user.roles:
            selected_songs = Song.query.all()
        if "Creator" in current_user.roles:
            selected_songs = Song.query.filter_by(creator=current_user).all()

        if len(selected_songs) > 0:
            return marshal(selected_songs,songs_fields)
        else:
            return {"message":"No songs found"}
        
    @auth_required("token")
    @roles_required('Creator')
    def post(self):
        args = parser.parse_args()
        song = Song(name=args.get('name'),
                     lyrics=args.get('lyrics'),
                     genre=args.get('genre'),creator_id=current_user.id)
        db.session.add(song)
        db.session.commit()
        return {"message":"Song placeholder created"}
    
    
     
api.add_resource(SongsAPI,'/songs')