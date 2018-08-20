export const Teams = {
  data: function() {
    return {
      form: {
        member_1: '',
        member_2: ''
      }
    };
  },
  computed: Vuex.mapState(['teams']),
  methods: {
    processForm: function() {
      console.log('processForm', this.form.member_1, this.form.member_2);

      this.$store.dispatch('addTeam', { form: this.form });
    },
    onDelete: function(id) {
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
