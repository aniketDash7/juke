export default {
    template: `
      <div class='d-flex justify-content-center' style="margin-top: 25vh">
      <h1>Administrator Login</h1>
        <div class="mb-3 p-5 bg-light">
          <form @submit.prevent='checkForm'>
            <p v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                <li v-for="error in errors">{{ error }}</li>
              </ul>
            </p>
            
            <label for="admin-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="admin-email" placeholder="Administrator" v-model="cred.email" required>
            <label for="admin-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="admin-password" v-model="cred.password" required>
            <button class="btn btn-primary mt-2">Login</button>
          </form>
          <p>If you're a new user : <router-link to="/userRegistration">User Registration</router-link></p>
          <p>If you're an existing user : <router-link to="/userLogin">User Login</router-link></p>
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
          this.adminLogin();
        }
      },
      validateEmail(email) {
        // Simple email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      },
      async adminLogin() {
        const res = await fetch('/admin_login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        });
        const data = await res.json();
        if (res.ok) {
          console.log('Admin Logged In Successfully');
          console.log(data.message);
          localStorage.setItem('auth-token',data.token)
          localStorage.setItem('role',data.role)
          this.$router.push(`/adminDashboard`);
        } else {
          this.errors.push(data.message);
        }
      }
    }
  }
  