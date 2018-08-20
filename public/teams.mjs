export const Teams = {
  data: function() {
    return {
      form: {
        member_1: '',
        member_2: ''
      }
    };
  },
  computed: Vuex.mapState(['timeslots', 'dates', 'schedule', 'teams']),
  methods: {
    processForm: function() {
      console.log('processForm', this.form.member_1, this.form.member_2);

      firestore.collection('teams').add({
        member_1: this.form.member_1,
        member_2: this.form.member_2
      }).then(ref => {
        console.log('success', ref);
      }, error => {
        console.log('error', error);
      });
    },
    onDelete: function(id) {
      console.log('onDelete', id)

      firestore.collection('teams').doc(id).delete().then(() => {
        console.log('deleted')
      }, error => {
        console.log('error', error)
      })
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    },
    generateSchedule: function() {
      console.log('generateSchedule', this.teams)

      let schedule = {};

      const slotCount = this.timeslots.length;
      for (let date of this.dates) {
        schedule[date] = {};

        // get a list of keys
        let ids = Object.keys(this.teams);
        this.shuffleArray(ids);

        // randomize starting location, incase the number of teams
        // is not evenly divisible
        let slotIndex = Math.floor(Math.random() * slotCount);
        // console.log(date, 'slot', slotIndex)

        for (let id of ids) {
          let timeslot = this.timeslots[slotIndex];
          // console.log('---', id, slotIndex, timeslot)

          if (!schedule[date][timeslot])
            schedule[date][timeslot] = [];
          schedule[date][timeslot].push(id);

          slotIndex = (slotIndex + 1) % slotCount;
        }

        // console.log('==================')
      }

      // console.log('schedule', schedule)
      // this.schedule = schedule;
      this.$store.commit('setSchedule', schedule);
    }
  },

  template: '#teams-template'
}
