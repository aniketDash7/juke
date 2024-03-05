export default{

    template:`
           
        <div class="rooted">
            <div class="intro">
                <h1>Juke</h1>
            </div>

            <div class="hyperlinks">
                <router-link to="/userRegistration">User Registration</router-link>
                <router-link to="/userLogin">User Login</router-link>
                <router-link to="/adminLogin">Administrator Login</router-link>
            </div>
        </div>
    
    `,
    mounted(){
        const style = document.createElement('style');
        style.textContent = `
            body{

                height:100%;
                width:100%;
                overflow:hidden;

            }

            .rooted{

                height:100vh;
                width:100vw;
                display:flex;
                justify-content:space-around;
                align-items:center;

            }

            .intro h1{

                font-size:6rem;
                margin-bottom:7rem;
            }

            .hyperlinks{

                width:20vw;
                height:30vh;
                text-decoration:none;
                background:white;
                margin-bottom:5rem;
                border-radius:20px;

            }
            .hyperlinks a{

                color:black;
                font-size:1.3rem;
                display:block;
                text-align:center;
                margin-top:2rem;

            }
        `;
        document.head.appendChild(style);
    }
}