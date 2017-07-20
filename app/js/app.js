const Vue = require('vue/dist/vue.common');
const Lorem = require('../components/lorem.vue');

const tabs = [
    {id: 'character', name: 'Character'},
    {id: 'industry', name: 'Industry'},
    {id: 'skills', name: 'Skills'},
    {id: 'preferences', name: 'Preferences'}
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
        lorem: Lorem
    }
});