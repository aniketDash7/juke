export default {
    template: `
      <div class='d-flex justify-content-center' style="margin-top: 25vh">
      <h1>User Login</h1>
        <div class="mb-3 p-5 bg-light">
          <form @submit.prevent='checkForm'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
            </p>
            
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password" required>
            <button class="btn btn-primary mt-2">Login</button>
          </form>
          <p>Don't have an account ? <router-link to="/userRegistration">Register</router-link></p>
        </div> 
      </div>
    `,
    data() {
      return {
        cred: {
          password: null,
          email: null,
        },
        errors: [],
      }
    },
    methods: {
      checkForm() {
        this.errors = [];
  
        if (!this.cred.email) {
          this.errors.push("Email is required.");
        } else if (!this.validateEmail(this.cred.email)) {
          this.errors.push("Please enter a valid email address.");
        }
  
        if (!this.cred.password) {
          this.errors.push("Password is required.");
        }
        if (this.cred.password.length < 8){
          this.errors.push("Password should be atleast 8 characters long");
        }
  
        if (this.errors.length === 0) {
          this.userLogin();
        }
      },
      validateEmail(email) {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      async userLogin() {
        const res = await fetch('/user_login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        });
        
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem('auth-token',data.token)
          localStorage.setItem('role',data.role)
          localStorage.setItem('username',data.username)
          console.log('User Logged In Successfully');
          this.$router.push(`/profile/${data.id}`)
          
        }else{
          this.errors.push(data.message);
        }
      }
    }
  }
  