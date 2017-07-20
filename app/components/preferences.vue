<template>
    <div>
        <h2>Login</h2>
        <div class="d-flex align-items-center">
            <div class="p-2"><strong>Status:</strong></div>
            <div class="p-2" v-if="isLoggedIn">Logged in</div>
            <div class="p-2" v-else><a href="#" @click.prevent="doLogin"><img src="images/eve_login_button.png" alt="EVE Login Button" class="img-fluid"></a></div>
        </div>
    </div>
</template>

<script>
    module.exports = {
        name: 'Preferences',
        data: function () {
            return {
                isLoggedIn: this.hasLoginTokens()
            };
        },
        methods: {
            hasLoginTokens: function () {
                const settings = require('electron').remote.require('electron-settings');
                return (settings.has('auth.accessToken') && settings.has('auth.refreshToken'));
            },
            doLogin: function () {
                const settings = require('electron').remote.require('electron-settings');
                // TODO Insert login
                this.isLoggedIn = this.hasLoginTokens();
            }
        }
    };
</script>

<style scoped>
/* Add CSS that is only used in this component */
</style>