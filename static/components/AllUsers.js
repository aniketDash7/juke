import Player from "./Player.js"
export default{

    template:`
    <div>
        <div class="container dashboard d-flex justify-content-between align-items-start">
            <div class="container userContainer" style="min-width:25vw;">
                <ul v-for="user in users"  class="container" style="display: grid;grid-template-columns: repeat(auto-fill, minmax(200px, 2fr));gap: 10px;">
                    <li v-if="user.email !== 'admin@email.com' && user.email !== 'ctor@email.com' && user.email !== 'user@email.com'">
                        <div class="container userDiv" style="border: 2px solid white;padding: 10px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: all 0.3s ease;">
                            <div class="container d-flex justify-content-between align-items-end">
                                <div>   

                                    <i class="bi bi-person-circle"></i><p>{{user.username}}</p>
                                    <p v-if="user.roles.includes('<Role 2>')" class="card-text">Creator Profile</p>
                                    <p v-if="user.roles.includes('<Role 3>')" class="card-text">User Profile</p>
                                    <a v-if="user.roles.includes('<Role 2>')" href="#" class="btn" style="border:1px solid black; background:None">Activate creator</a>
                                
                                </div>

                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="songstats container" style="min-width:25vw">
                <ul v-for="song in this.songs">
                <li>
                    <div class="container songDiv" style="border: 2px solid white;padding: 10px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: all 0.3s ease;">
                        <div class="container d-flex justify-content-between align-items-end">
                            <div>   

                                <h5 class="m-0">{{song.name}}</h5>
                                <p style="font-size:0.9rem" class="m-0">{{song.genre}}</p>
                                <p style="font-size:0.9rem" class="m-0">{{song.date_created}}</p>
                                <div class="musicActions">
                                    <i style="font-size:1.9rem" class="bi bi-play-circle" @click="playSong(song.songUrl)" id="play"></i>
                                    <i data-bs-toggle="modal" @click="deleteSong(song.id)" class="bi bi-trash-fill"></i>
                                </div>
                                        
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
                                        <button type="button" class="btn btn-danger" @click="deleteSong(song.id)" data-bs-dismiss="modal">Delete Song</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>

                            
                            </div>

                        </div>
                    </div>
                </li>
                </ul>
                <canvas id="songChart" width="200" height="200"></canvas>
            </div>
                
            <div class="stats container card text-center" style="min-width:25vw;border: 2px solid white;padding: 10px;border-radius: 8px;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);transition: all 0.3s ease;">
                <div class="card-body">
                    <h5 class="card-title">Number of user profiles : {{this.userProfiles}}</h5>
                    <h5 class="card-title">Number of creator profiles : {{this.creatorProfiles}}</h5>
                </div>
                <canvas id="profileChart" width="200" height="200"></canvas>
            </div>
        
    

        </div>
        <Player ref="musicPlayer" />
    
    </div>`,
    data(){
        return{

            users:[],
            token:localStorage.getItem('auth-token'),
            role:localStorage.getItem('role'),
            userProfiles:0,
            creatorProfiles:0,
            error:[],
            songs:[],
            chart:null,
            releaseDates:[],
            songchart:null,
            releasesCount:null,
            years:null,

//like create a route to activate a creator : easy
//delete songs that violate company policy

        }
    },

    async mounted(){
        const res = await fetch('/all_users',{
            headers:{
                'Authentication-Token':this.token,
                'Role':this.role,
            },
        })
        const data = await res.json().catch((e)=>{})
        if (res.ok){
            this.users = data;
            if (this.users){

                for(let i=0; i<this.users.length;i++){
                    if(this.users[i].roles.includes('<Role 2>') && this.users[i].email !== 'ctor@email.com'){
                        this.creatorProfiles ++;
                    }
                    if(this.users[i].roles.includes('<Role 3>') && this.users[i].email !== 'user@email.com'){
                        this.userProfiles ++;
                    }
                }
    
            }   
        }else{
            this.error.push(res.status)
        }

        const response = await fetch('/api/songs',{
            headers:{
            'Authentication-Token':this.token
            }
        });
        const received = await response.json().catch((e)=>{})
        if(res.ok){
            this.songs = received;
        }else{
            console.log(res.status);
        }
      
        if (Array.isArray(this.songs)) {
            this.songs.forEach(song => {
                const converted = new Date(song.date_created);
                const years = converted.getFullYear();
                this.releaseDates.push(years);
            });
            const releasesPerYear = {};
            this.releaseDates.forEach((year) => {
                releasesPerYear[year] = (releasesPerYear[year] || 0) + 1;
            });
    
            // Convert releasesPerYear object to arrays for chart data
            this.years = Object.keys(releasesPerYear);
            this.releasesCount = Object.values(releasesPerYear);
        }
        
        
        this.drawChart();
        
    },
    components:{
        Player

    },
    methods: {
        playSong(songUrl) {
            this.$refs.musicPlayer.playSong(songUrl);
        },
        async deleteSong(id){
            const resp = await fetch(`/delete_song/${id}`,{
              headers:{
                'Authentication-Token':this.token
              }
            })
            const recd = await resp.json().catch((e)=>{})
            if(resp.ok){
              this.songs = recd;
            }else{
              this.error = resp.status
            }
            window.location.reload();
  
  
  
          },
        drawChart() {
          // Check if the chart already exists and destroy it to prevent duplicates
          if (this.chart) {
            this.chart.destroy();
          }
    
          // Create a new chart instance
          const ctx = document.getElementById('profileChart').getContext('2d');
          const songstat = document.getElementById('songChart').getContext('2d');
    
          this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['User Profiles', 'Creator Profiles'],
              datasets: [
                {
                  data: [this.userProfiles, this.creatorProfiles],
                  backgroundColor: ['#355070', '#e56b6f'],
                },
              ],
            },
            options: { // Set to false if you want a fixed size
              legend: {
                position: 'top',
              },
            },
          });
        
          this.songchart = new Chart(songstat,{
            type:'bar',
            data:{
                labels: this.years,
                datasets:[
                    {
                        label:'Number of Releases',
                        data:this.releasesCount,
                        backgroundColor: ['#355070'],
                        // '#e56b6f'
                    },
                ],
            },
            options:{
                legend:{
                    position:'top'
                },
            },
            scales: {
                xAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Year',
                  },
                }],
                yAxes: [{
                  scaleLabel: {
                    display: true,
                    labelString: 'Number of Releases',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                }],
              },
          });

        },
      },


}