const Vue = require('vue/dist/vue.common');
const $ = require("jquery");
const Lorem = require('../components/lorem.vue');
const Character = require('../components/character.vue');
const Preferences = require('../components/preferences.vue');

const tabs = [
    {
        id: 'character',
        name: 'Character',
        component: 'character'
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
                return 'esi-universe.read_structures.v1 esi-location.read_location.v1 esi-location.read_online.v1 esi-wallet.read_character_wallet.v1';
            },
            get oauthConfig() {
                return {
                    clientId: 'd8ff8d1ea28d453b8faf7270c07e1115',
                    clientSecret: this.clientSecret,
                    authorizationUrl: 'https://login.eveonline.com/oauth/authorize',
                    tokenUrl: 'https://login.eveonline.com/oauth/token',
                    useBasicAuthorizationHeader: true,
                    redirectUri: 'http://localhost:5225/callback'
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
    },
    methods: {
        getCharacterInfoPromise: function () {
            return new Promise((resolve, reject) => {
                const settings = require('electron').remote.require('electron-settings');
                if (settings.has('auth.access_token') && settings.has('auth.refresh_token') && settings.has('auth.expires_in')) {
                    $.ajax('https://login.eveonline.com/oauth/verify', {
                        headers: {
                            Authorization: 'Bearer ' + settings.get('auth.access_token')
                        },
                    }).then(data => {
                        resolve(data);
                    }, error => {
                        reject(error);
                    });
                } else {
                    reject(new Error('User not logged in!'));
                }
            });
        },
        hasTokens: function() {
            const settings = require('electron').remote.require('electron-settings');
            return settings.has('auth.access_token') && settings.has('auth.refresh_token') && settings.has('auth.expires_in');
        }
    }
});

Vue.component('notloggedin', require('../components/notloggedin.vue'));

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
        character: Character,
        preferences: Preferences,
    }
});