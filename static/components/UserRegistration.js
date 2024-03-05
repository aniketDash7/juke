export default {
  template: `
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
    <h1>User Registration</h1>
      <div class="mb-3 p-5 bg-light">
        <form @submit.prevent='checkForm'>
          <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors">{{ error }}</li>
            </ul>
          </p>
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="user-name" placeholder="Username" v-model="cred.username" required>
          <label for="user-email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email" required>
          <label for="user-password" class="form-label">Password</label>
          <input type="password" class="form-control" id="user-password" v-model="cred.password" required>
          <label for="repeat-password" class="form-label">Repeat Password</label>
          <input type="password" class="form-control" id="repeat-password" v-model="cred.repeatPassword" required>
          <label for="creator-check" class="form-label"> Check if you want to be a creator </label>
          <input type="checkbox" id="creator-check" v-model='cred.creatorCheck'><br>

          <button class="btn btn-primary mt-2">Register</button>
        </form>
        <p>Already have an account ? <router-link to="/userLogin">Login</router-link></p>
      </div> 
    </div>
  `,
  data() {
    return {
      cred: {
        username: null,
        password: null,
        email: null,
        repeatPassword: null,
        creatorCheck:false
      },
      errors: [],
    }
  },
  methods: {
    checkForm() {
      this.errors = [];

      if (!this.cred.username) {
        this.errors.push("Username is required.");
      }

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

      if (!this.cred.repeatPassword) {
        this.errors.push("Repeat Password is required.");
      } else if (this.cred.repeatPassword !== this.cred.password) {
        this.errors.push("Passwords do not match.");
      }

      if (this.errors.length === 0) {
        this.userRegister();
      }
    },
    validateEmail(email) {
      // Simple email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    async userRegister() {
      const res = await fetch('/user_register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cred),
      });
      const data = await res.json();
      if (res.ok) {
        console.log('User registered Successfully');
        this.$router.push(`/userLogin`);
      } else {
        this.errors.push(data.message);
      }
    }
  }
}
