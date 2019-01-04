export const Teams = {
  data: function() {
    return {
      form: {
        member_1: '',
        member_2: ''
      }
    };
  },
  computed: Vuex.mapState(['timeslots', 'dates', 'teams']),
  methods: {
    addDate: function() {
      this.$store.dispatch('addDate', { form: this.form });
      this.form.member_1 = '';
    },
    addTimeslot: function() {
      this.$store.dispatch('addTimeslot', { form: this.form });
      this.form.member_1 = '';
    },
    addTeam: function() {
      console.log('processForm', this.form.member_1, this.form.member_2);

      this.$store.dispatch('addTeam', { form: this.form });
      this.form.member_1 = '';
      this.form.member_2 = '';
    },
    onDeleteDate: function(date) {
      this.$store.dispatch('deleteDate', { date });
    },
    onDeleteTimeslot: function(timeslot) {
      this.$store.dispatch('deleteTimeslot', { timeslot });
    },
    onDeleteTeam: function(id) {
      console.log('onDelete', id)

      this.$store.dispatch('deleteTeam', { id });
    },
    generateSchedule: function() {
      this.$store.dispatch('generateSchedule');
      this.$router.push('/');
    }
  },

  template: '#teams-template'
}
