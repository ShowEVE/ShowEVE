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