import Player from "./Player.js"
export default{

    template:`

    <div>
    
        <h3>{{ this.account_username }}</h3>
        <ul v-for="message in messages">
            <li>{{message.message}}</li>
        </ul>
        <i @click="followUser(account_username)" class="bi bi-person-fill-add"></i>
        <ul class="container" style="display: grid;grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));gap: 20px;" v-if="this.account_songs !== null">
            <li v-for="song in this.account_songs">
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
        <h1 v-else>No songs here :(</h1>
        <Player ref="musicPlayer" />
    </div>

    
    `,
    data(){

        return{

            account_id : this.$route.params.id,
            account_username:this.$route.params.username,
            account_songs:[],
            errors:[],
            messages:[]

        }

    },

    methods:{

        async followUser(username){
            const res = await fetch(`/follow/${username}`)
            const follow_data = await res.json().catch((e)=>{})
            if (res.ok){
                this.messages.push(follow_data)
            }else{
                this.errors.push(res.status)
            }
            
        },
        playSong(songUrl) {
            this.$refs.musicPlayer.playSong(songUrl);
        },

    },
    components:{

        Player

    },
    async mounted(){

        const res = await fetch(`/account_page/${this.account_id}/${this.account_username}`)
        const data_received = await res.json().catch((e)=>{})
        if (res.ok){
            this.account_songs = data_received
            console.log("this.account_songs:", this.account_songs);
        }else{
            this.errors = res.status
        }

    }


}