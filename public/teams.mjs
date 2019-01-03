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
    addTeam: function() {
      console.log('processForm', this.form.member_1, this.form.member_2);

      this.$store.dispatch('addTeam', { form: this.form });
      this.form.member_1 = '';
      this.form.member_2 = '';
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
