import AllUsers from "./AllUsers.js"

export default{

    template: `
    <div>
          <nav class="navbar bg-body-tertiary">
          <div class="container-fluid">
            <div class="usercreds">
              <h2 class="navbar-brand">{{userRole}} profile</h2>
            </div>
            
            <form class="d-flex" role="search">
              <button type="button" class="btn logoutButton" data-bs-toggle="modal" data-bs-target="#logoutModal"><i style="font-size:1.6rem;" class="bi bi-box-arrow-left"></i></button>
            </form>
          </div>
        </nav>
        <AllUsers/>
        <div class="modal fade" id="logoutModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Confirm Logout</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to log out?
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>


    </div>
    
    `,
    data(){

        return{

            userRole:localStorage.getItem('role'),
            isLoggedIn:localStorage.getItem('auth-token'),

        }

    },
    methods:{

        logout(){

            localStorage.removeItem('role'),
            localStorage.removeItem('auth-token'),
            this.$router.push('/adminLogin')

        },
    },
    
    components:{
        AllUsers,

    }

}