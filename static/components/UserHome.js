import Player from "./Player.js"
export default{

    template:`
    
    <div>
    
    <h1> Welcome home user </h1>
    <div>
            
        <ul v-for="people in this.ptf">
                
            <li v-if="people.username" @click="accountPage(people.id,people.username)"> <i style="cursor:pointer;" class="bi bi-person"></i> {{people.username}}</li>

        </ul>
        <ul class="container" style="display: grid;grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));gap: 20px;">
            <li v-for="song in this.followedSongs">
                <div class="container songDiv" style="border: 2px solid white;padding: 10px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: all 0.3s ease;">
                    <div class="container d-flex justify-content-between align-items-end">
                        <div>
                            <img style="margin-left:1rem;border:2px solid black;border-radius:10px;" :src="'static/posterfiles/' + song.poster" alt="Music Poster" class="music-poster" width="260" height="150" />
                            <h4>{{ song.name }}</h4>
                            <p>{{ song.genre }}</p>
                            <p>{{ song.date_created }}</p>
                        </div>
                        <i style="font-size:3rem;" @click="playSong(song.songUrl)" class="bi bi-play-circle" id="play"></i>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <Player ref="musicPlayer" />
    </div>
    
    `,

    data(){

        return{ 

            user_id : this.$route.params.id,
            token : localStorage.getItem('auth-token'),
            username:localStorage.getItem('username'),
            ptf : [],
            error:[],
            followedSongs:[]

        }

    },
    async mounted(){


        const response = await fetch(`/song_fetcher/${this.username}`,{
            headers:{
            'Authentication-Token':this.token
            }
        })
        const received = await response.json().catch((e)=>{})
        if (response.ok){
            this.followedSongs.push(received);
            console.log("Everything's alright let's go")
        }else{
            this.error = res.status
        }

        const res = await fetch(`people_to_follow/${this.user_id}`,{
            headers:{
                'Authentication-Token':this.token
            }
        })
        const rec = await res.json().catch((e)=>{})
        if (res.ok){
            this.ptf = rec
        }else{
            this.error = res.status
        }

    },
    methods:{

        accountPage(id,username){

            this.$router.push(`/account/${id}/${username}`)
            
        },
        playSong(songUrl) {
            this.$refs.musicPlayer.playSong(songUrl);
        },

    },
    components:{

        Player
    },

}

