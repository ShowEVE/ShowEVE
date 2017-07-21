<template>
    <div>
        <notloggedin v-if="!isLoggedIn"></notloggedin>
        <div v-else>
            <div class="refresh-box">
                <i class="fa fa-3x fa-refresh" :id="`refresh-${$options.name}`" @click="updateValues"></i>
            </div>
            <h2>Details</h2>
            <div class="d-flex justify-content-start">
                <div>
                    <table class="table-align-start table-pr-2">
                        <tbody>
                            <tr>
                                <td><strong>Name:</strong></td>
                                <td>
                                    <span v-if="character">{{ character.CharacterName }}</span>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Balance:</strong></td>
                                <td>
                                    <span v-if="character">{{ iskBalance.toLocaleString('en-US') }} ISK</span>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Online:</strong></td>
                                <td>
                                    <span class="text-success" v-if="statusOnline">Online</span>
                                    <span class="text-danger" v-else>Offline</span>
                                </td>
                            </tr>
                            <tr>
                                <td><strong>Location:</strong></td>
                                <td>
                                    <span v-if="character">{{ location }}</span>
                                    <span v-else><em>Unknown</em></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="ml-auto mw-30">
                    <img v-if="character" :src="`https://imageserver.eveonline.com/Character/${character.CharacterID}_1024.jpg`" :alt="`Portrait of ${character.CharacterName}`" class="img-fluid">
                </div>
            </div>
            <hr/>
        </div>
    </div>
</template>

<script>
    const $ = require("jquery");
    module.exports = {
        name: 'Character',
        data: function () {
            return {
                isLoggedIn: false,
                character: null,
                iskBalance: 0.0,
                statusOnline: false,
                location: 'Unknown'
            };
        },
        methods: {
            updateValues: async function () {
                const refreshEl = $(`#refresh-${this.$options.name}`);
                refreshEl.addClass('fa-spin');
                const settings = require('electron').remote.require('electron-settings');
                const oauth = require('electron').remote.require('electron-oauth2')(this.oauthConfig, this.oauthWindowParams);

                this.isLoggedIn = this.hasTokens();
                if (this.isLoggedIn) {
                    if (Date.now() / 1000 > settings.get('auth.expires_in')) {
                        const newToken = await oauth.refreshToken(settings.get('auth.refresh_token'));
                        newToken.expires_in = newToken.expires_in + (Date.now() / 1000) - 30;
                        settings.set('auth', newToken);
                    }
                    this.character = await this.getCharacterInfoPromise();
                    this.iskBalance = await $.ajax(`https://esi.tech.ccp.is/latest/characters/${this.character.CharacterID}/wallet/`, {
                        headers: {
                            Authorization: `Bearer ${settings.get('auth.access_token')}`
                        }
                    });
                    this.statusOnline = await $.ajax(`https://esi.tech.ccp.is/latest/characters/${this.character.CharacterID}/online/`, {
                        headers: {
                            Authorization: `Bearer ${settings.get('auth.access_token')}`
                        }
                    });
                    const location = await $.ajax(`https://esi.tech.ccp.is/latest/characters/${this.character.CharacterID}/location/`, {
                        headers: {
                            Authorization: `Bearer ${settings.get('auth.access_token')}`
                        }
                    });
                    let queryId = 0;
                    if (location.structure_id) {
                        queryId = location.structure_id;
                    } else if (location.station_id) {
                        queryId = location.station_id;
                    } else {
                        queryId = location.solar_system_id;
                    }
                    console.log(location);
                    const realLocation = await $.ajax('https://esi.tech.ccp.is/latest/universe/names/', {
                        method: 'POST',
                        contentType: 'application/json',
                        data: `[${queryId}]`,
                        headers: {
                            Authorization: `Bearer ${settings.get('auth.access_token')}`
                        }
                    });
                    console.log(realLocation);
                    this.location = realLocation[0].name;
                }
                refreshEl.removeClass('fa-spin');
            }
        },
        created: function () {
            this.updateValues();
        }
    };
</script>

<style scoped>
    /* Add CSS that is only used in this component */
</style>