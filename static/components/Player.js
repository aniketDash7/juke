export default {
    template: `
    <div>
      <nav style="background:black; color:white;" class="navbar fixed-bottom bg-body-tertiary">
        <div class="container-fluid" style="display:flex; justify-content:center; font-size:3rem;align-items:center;">
          <i v-if="!isPlaying" class="bi bi-play-circle" @click="playSong(currentSongUrl)"></i>
          <i v-if="isPlaying" class="bi bi-pause-circle-fill" @click="pauseSong"></i>
          <i class="bi bi-stop-circle"></i>
          <audio controls
            ref="audioPlayer"
            :src="'static/trackfiles/' + currentSongUrl"
            @ended="resetPlayback"
            @play="updatePlayState"
            @pause="updatePlayState">
          </audio>
        </div>
      </nav>
    </div>
    `,
    data() {
      return {
        currentSongUrl: null,
        isPlaying: false,
      };
    },
    methods: {
      playSong(songUrl) {
        this.currentSongUrl = songUrl;
  
        if (this.$refs.audioPlayer.paused) {
          let playPromise = this.$refs.audioPlayer.play();
          if (playPromise !== undefined){
            playPromise.then(function(){
              console.log('playing started');
            }).catch(function(error){
              console.log(error);
            });
          }

        } else {
          this.$refs.audioPlayer.pause();
        }
      },
      pauseSong() {
        if (!this.$refs.audioPlayer.paused) {
          this.$refs.audioPlayer.pause();
        }
      },
      updatePlayState() {
        this.isPlaying = !this.$refs.audioPlayer.paused;
      },
      resetPlayback() {
        this.$refs.audioPlayer.currentTime = 0;
        this.isPlaying = false;
      },
    },
  };
  