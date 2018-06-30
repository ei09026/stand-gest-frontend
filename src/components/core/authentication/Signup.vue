<template>
    <div class="col-sm-4 col-sm-offset-4">
        <h2>Sign Up</h2>
        <p>Sign up for a free account to get some great quotes.</p>
        <div class="alert alert-danger" v-if="error">
            <p>{{ error }}</p>
        </div>
        <div class="form-group">
            <input type="text"
                   class="form-control"
                   placeholder="Enter your username"
                   v-model="credentials.username">
        </div>
        <div class="form-group">
            <input type="password"
                   class="form-control"
                   placeholder="Enter your password"
                   v-model="credentials.password">
        </div>
        <button class="btn btn-success" @click="submit()">Access</button>
    </div>
</template>

<script>
    import authService from '@/services/shared/auth.service'

    export default {
        data () {
            return {
                credentials: {
                    username: '',
                    password: ''
                },

                error: ''
            }
        },

        methods: {
            submit () {
                var credentials = {
                    username: this.credentials.username,
                    password: this.credentials.password
                }

                authService.signup(this, credentials, 'secretquote')
            }
        }
    }
</script>
