import Player from "./Player.js";
export default{

    template:`
    <div>
    

    <div class="creator-credentials">
    <h5 style="color:white; background:black; padding:10px; width:10vw;margin-left:2rem">{{this.username}}</h5>
    </div>

    <div class="music-list">
      <div v-if="creator_songs" class="no-songs-message">
        <p>{{this.creator_songs.message}}</p>
      </div>
      <div v-if="creator_songs.length>0" v-for="(track, index) in creator_songs" class="music-item">
        <div class="music-details">
          <img v-if="creator_songs.length > 0" :src="'static/posterfiles/' + track.poster" alt="Music Poster" class="music-poster" width="260" height="150">
         <div class="music-creds">
          <h4>{{ track.name }}</h4><br>
          <h6>{{ track.genre }}</h6><br>
         </div>
         <i data-toggle="collapse" :href="'#musicActionCollapsible'+track.id" class="bi bi-arrow-down-circle"></i>
         <div class="collapse" :id="'musicActionCollapsible'+track.id">
          <div class="music-actions">
            <i class="bi bi-pencil-fill" data-bs-toggle="modal" data-bs-target="#updateModal"></i>
            <i class="bi bi-play-circle" id="play" @click="playSong(track.songUrl)"></i>
            <i data-bs-toggle="modal" data-bs-target="#deleteModal" class="bi bi-trash-fill"></i>
          </div>
          <div class="song-lyrics overflow-auto"style="max-width: 300px; max-height: 150px;">
            <h6>Lyrics</h6>
            <p>{{track.lyrics}}<p>
          </div>
         </div>

              
          <!--delete Modal-->
          <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h4 class="modal-title fs-5" id="exampleModalLabel">Deletion</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  Do you want to delete this song ?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-danger" @click="deleteSong(track.id)" data-bs-dismiss="modal">Delete Song</button>
                </div>
              </div>
            </div>
          </div>


         <!--Update Modal -->
         <div class="modal fade" id="updateModal" tabindex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
           <div class="modal-dialog">
             <div class="modal-content">
               <div class="modal-header">
                 <h1 class="modal-title fs-5" id="updateModalLabel">Modal title</h1>
                 <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
               </div>
               <div class="modal-body">
                 
                 <!--Form-->
                 <form @submit.prevent="updateCheckForm">
                   <p v-if="errors.length" class="text-danger">
                     <b>Please correct the following error(s):</b>
                     <ul>
                       <li v-for="error in errors">{{ error }}</li>
                     </ul>
                   </p>
     
                   <div class="form-group">
                     <input id="song-name" type="textarea" v-model="song.lyrics" class="form-control" placeholder="Update lyrics" required>
                   </div>
    
     
                   <input class="btn btn-secondary" type="submit" style="background-color: #343a40; color: #fff;">
                 </form>
     
               </div>
               <div class="modal-footer">
                 <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                 <button type="button" class="btn btn-primary">Save changes</button>
               </div>
             </div>
           </div>
         </div>
          
        </div>
      </div>
    </div>

    <button
      data-toggle="modal"
      data-target="#myModal"
      class="add_button btn btn-dark">+
    </button>

                          <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                              <div class="modal-content">
                                <div class="modal-header" style="background-color: #343a40; color: #fff;">
                                  <h5 class="modal-title" id="exampleModalLabel">Upload Song</h5>
                                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>

                                <div class="modal-body">
                                  <form @submit.prevent="checkForm">
                                    <p v-if="errors.length" class="text-danger">
                                      <b>Please correct the following error(s):</b>
                                      <ul>
                                        <li v-for="error in errors">{{ error }}</li>
                                      </ul>
                                    </p>

                                    <div class="form-group">
                                      <input id="song-name" type="text" v-model="song.name" class="form-control" placeholder="Name of the track" required>
                                    </div>
                                    <div class="form-group">
                                      <input id="song-genre" type="text" v-model="song.genre" class="form-control" placeholder="Genre of the track (optional)">
                                    </div>
                                    <div class="form-group">
                                      <input id="song-name" type="date" v-model="song.releaseDate" class="form-control" placeholder="Release Date (Optional)">
                                    </div>
                                    <div class="form-group">
                                      <input id="song-duration" type="text" v-model="song.duration" class="form-control" placeholder="Duration of the track">
                                    </div>
                                    <div class="form-group">
                                      <input id="song-name" type="textarea" v-model="song.lyrics" class="form-control" placeholder="Lyrics">
                                    </div>

                                    <div class="form-group">
                                      <label for="image-file">Select Poster for the track</label>
                                      <input name="file" id="image-file" type="file" accept=".jpg, .jpeg, .png, .gif, .bmp" @change="posterUpload" class="form-control">
                                    </div>

                                    <div class="form-group">
                                      <label for="song-file">Select Song File (MP3)</label>
                                      <input name="file" id="song-file" type="file" accept=".mp3" @change="fileUpload" class="form-control">
                                    </div>

                                    <input class="btn btn-secondary" type="submit" style="background-color: #343a40; color: #fff;">
                                  </form>
                                </div>

                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-dismiss="modal" style="background-color: #343a40;">Close</button>
                                </div>
                              </div>
                            </div>
                          </div>
  <Player ref="musicPlayer" />
  </div>
    `,

    data(){

        return{
            song:{
                name:null,
                genre:null,
                releaseDate:null,
                lyrics:null,
                duration:null,
                creator_id:this.$route.params.id,
                songFile:null,
                poster:null,
            },
            username:localStorage.getItem('username'),
            token:localStorage.getItem('auth-token'),
            errors:[],
            creator_songs:[],

        }

    },
    async mounted(){
      const style = document.createElement('style');
      style.textContent = `
      .music-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* Adjust the values as needed */
        gap: 20px; /* Adjust the gap between items */
      }

      .music-poster{

        border:2px solid black;
        border-radius:10px;

      }
      
      .music-item {
        border: 2px solid white;
        padding: 5px;
        margin:0.1rem;
        border-radius: 15px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
      }
      
      .music-item:hover {
        background-color: black;
        color:white;
        border: 2px solid black;
      }
      
      .music-details {
        text-align: center;
        margin:0.1rem;
      }

      
      i:hover{

        color:red;

      }
      
      .music-actions{

        display:flex;
        justify-content:space-around;
        align-items:center;

      }
      .music-actions i{

        font-size:1rem;
        cursor:pointer;

      }
      .music-actions #play{

        font-size:2.5rem;

      }

      `;
      document.head.appendChild(style);

      const res = await fetch(`/creator_songs/${this.song.creator_id}`,{
        headers:{
          'Authentication-Token':this.token
        },
      })
      const data = await res.json().catch((e)=>{})
      if (res.ok){
          this.creator_songs = data

      }else{
          this.error = data.message;
      }

    },
    components:{
      Player
    },

    methods:{
        fileUpload(event){
            this.song.songFile = event.target.files[0];
            console.log(this.song.songFile);
        },
        posterUpload(event){
          this.song.poster = event.target.files[0];
        },
        playSong(songUrl) {
          this.$refs.musicPlayer.playSong(songUrl);
        },

        async deleteSong(id){
          const res = await fetch(`/delete_song/${id}`,{
            headers:{
              'Authentication-Token':this.token
            }
          })
          const rec = await res.json().catch((e)=>{})
          if(res.ok){
            this.creator_songs = rec;
          }else{
            this.error = res.status
          }
          window.location.reload();



        },
        updateCheckForm(){
          this.updateSong();
        },
        checkForm() {
            this.errors = [];
      
            if (!this.song.name) {
              this.errors.push("Track name is required.");
            }
      
            if (!this.song.duration) {
                this.errors.push("Track duration is required.");
            }

            if(!this.song.releaseDate){
                this.errors.push("Please mention the release Date of the song");
            }

            if (this.errors.length === 0) {
              this.uploadSong();
            }
          },  
          async updateSong(){
            const updateFormData = new FormData();
            updateFormData.append('lyrics',this.song.lyrics);
            const resolve = await fetch('/update_song',{
              method:'POST',
              body:updateFormData,
          });
          const datareceived = await resolve.json();
            if(resolve.ok){
                console.log("Song updated Successfully");
                
            }else{
                this.errors.push(datareceived.message);
            }

            window.location.reload();
          },
          async uploadSong(){
            const formData = new FormData();
            formData.append('name', this.song.name);
            formData.append('genre', this.song.genre);
            formData.append('releaseDate', this.song.releaseDate);
            formData.append('lyrics', this.song.lyrics);
            formData.append('duration', this.song.duration);
            formData.append('creator_id', this.song.creator_id);
            formData.append('songfile', this.song.songFile);
            formData.append('posterfile', this.song.poster);
            const res = await fetch('/upload_song',{
                method:'POST',
                body:formData,
            });
            const data = await res.json();
            if(res.ok){
                console.log("Song uploaded Successfully");
                
            }else{
                this.errors.push(data.message);
            }

            window.location.reload();
        }
    },
  
}