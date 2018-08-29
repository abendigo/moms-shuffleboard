export const Schedule = {
  computed: Vuex.mapState(['timeslots', 'dates', 'schedule', 'teams']),
  methods: {
    getTeam: function(id) {
      return this.teams && this.teams[id] || {};
    }
  },
  template: '#schedule-template'
};
