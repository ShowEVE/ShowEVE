const Vue = require('vue/dist/vue.common');
const Lorem = require('../components/lorem.vue');
const Preferences = require('../components/preferences.vue');

const tabs = [
    {
        id: 'character',
        name: 'Character',
        component: 'lorem'
    },
    {
        id: 'industry',
        name: 'Industry',
        component: 'lorem'
    },
    {
        id: 'skills',
        name: 'Skills',
        component: 'lorem'
    },
    {
        id: 'preferences',
        name: 'Preferences',
        component: 'preferences'
    }
];

Vue.mixin({
    data: function () {
        return {
            get isLoggedIn() {
                const settings = require('electron').remote.require('electron-settings');
                return (settings.has('auth.access_token') && settings.has('auth.refresh_token') && settings.has('auth.expires_in'));
            },
            set isLoggedIn(data) {
                // Do nothing, dummy method to trigger observer
            },
            get encryptedSecret() {
                return 'YEHp4vWm5/0rjxQ5PtuOPdlQayiPRnmsE/o2JTJy8UhhSGfm9hqxBFaWSBPPiA0u';
            },
            get clientSecret() {
                const crypto = require('electron').remote.require('crypto');
                const decipher = crypto.createDecipher('aes128', 'Sh0wEVEK3y');
                let decrypted = decipher.update(this.encryptedSecret, 'base64', 'utf8');
                return decrypted + decipher.final('utf8');
            },
            get scope() {
                return 'esi-skills.read_skills.v1 esi-skills.read_skillqueue.v1 esi-wallet.read_character_wallet.v1';
            },
            get oauthConfig() {
                return {
                    clientId: 'd8ff8d1ea28d453b8faf7270c07e1115',
                    clientSecret: this.clientSecret,
                    authorizationUrl: 'https://login.eveonline.com/oauth/authorize',
                    tokenUrl: 'https://login.eveonline.com/oauth/token',
                    useBasicAuthorizationHeader: true,
                    redirectUri: 'http://localhost:5225/callback',
                    infoUrl: 'https://login.eveonline.com/oauth/verify'
                };
            },
            get oauthWindowParams() {
                return {
                    width: 1024,
                    minWidth: 1024,
                    maxWidth: 1024,
                    height: 768,
                    minHeight: 768,
                    maxHeight: 768
                }
            }
        };
    }
});

new Vue({
    el: "#navmenu",
    data: {
        links: tabs
    }
});

new Vue({
    el: '#main',
    data: {
        tabs: tabs
    },
    components: {
        lorem: Lorem,
        preferences: Preferences
    }
});