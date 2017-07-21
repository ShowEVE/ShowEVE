<template>
    <div>
        <h2>API Access</h2>
        <div class="d-flex align-items-center">
            <div class="mr-2"><strong>Status:</strong></div>
            <div v-if="isLoggedIn">Logged in as {{ characterName }}</div>
            <div v-else><a href="#" @click.prevent="doLogin"><img src="images/eve_login_button.png" alt="EVE Login Button" class="img-fluid"></a></div>
        </div>
        <div class="d-flex align-items-center mt-2" v-if="isLoggedIn">
            <div><button class="btn btn-danger" @click.prevent="doLogout">Logout</button></div>
        </div>
        <hr/>
    </div>
</template>

<script>
    module.exports = {
        name: 'Preferences',
        data: function () {
            return {
                isLoggedIn: false,
                characterName: ''
            };
        },
        methods: {
            propagateChange: function () {
                this.$root.$children.forEach(function (component) {
                    if (component.updateValues !== undefined) {
                        component.updateValues();
                    }
                });
            },
            doLogin: async function () {
                const remote = require('electron').remote;
                const settings = remote.require('electron-settings');
                const OAuth = remote.require('electron-oauth2');
                const oauth = OAuth(this.oauthConfig, this.oauthWindowParams);
                const token = await oauth.getAccessToken({
                    scope: this.scope
                });
                token.expires_in = token.expires_in + (Date.now() / 1000) - 30;
                settings.set('auth', token);
                this.characterName = (await this.getCharacterInfoPromise()).CharacterName;
                this.isLoggedIn = this.hasTokens();
                this.propagateChange();
            },
            doLogout: function () {
                require('electron').remote.require('electron-settings').delete('auth');
                this.isLoggedIn = false;
                this.propagateChange();
            }
        },
        created: async function () {
            const settings = require('electron').remote.require('electron-settings');
            const oauth = require('electron').remote.require('electron-oauth2')(this.oauthConfig, this.oauthWindowParams);

            this.isLoggedIn = this.hasTokens();
            if (this.isLoggedIn) {
                if (Date.now() / 1000 > settings.get('auth.expires_in')) {
                    const newToken = await oauth.refreshToken(settings.get('auth.refresh_token'));
                    newToken.expires_in = newToken.expires_in + (Date.now() / 1000) - 30;
                    settings.set('auth', newToken);
                }
                this.characterName = (await this.getCharacterInfoPromise()).CharacterName;
            }
        }
    };
</script>

<style scoped>
    /* Add CSS that is only used in this component */
</style>