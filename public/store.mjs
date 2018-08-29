
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

export const store = new Vuex.Store({
  state: {
    timeslots: ['13:00', '14:00', '15:00'],
    dates: [
      'Sep 20', 'Sep 27', 'Oct 04', 'Oct 11', 'Oct 18',
      'Oct 25', 'Nov 01', 'Nov 08', 'Nov 15', 'Nov 22'
    ],

    teams: [],
    schedule: {
      'Sep 24': {'13:00': [], '14:00': [], '15:00': []},
      'Oct 01': {'13:00': [], '14:00': [], '15:00': []},
      'Oct 08': {'13:00': [], '14:00': [], '15:00': []},
      'Oct 15': {'13:00': [], '14:00': [], '15:00': []},
      'Oct 22': {'13:00': [], '14:00': [], '15:00': []},
      'Oct 29': {'13:00': [], '14:00': [], '15:00': []},
      'Nov 05': {'13:00': [], '14:00': [], '15:00': []},
      'Nov 12': {'13:00': [], '14:00': [], '15:00': []},
      'Nov 19': {'13:00': [], '14:00': [], '15:00': []},
      'Nov 26': {'13:00': [], '14:00': [], '15:00': []}
    },

    user: undefined
  },
  mutations: {
    setTeams(state, teams) { state.teams = teams; },
    setSchedule(state, schedule) { state.schedule = schedule; },
    setUser(state, user) { state.user = user; }
  },
  actions: {
    addTeam: function({commit}, {form}) {
      console.log('addTeam', form.member_1, form.member_2)

      firestore.collection('teams').add({
        member_1: form.member_1,
        member_2: form.member_2
      }).then(ref => {
        console.log('success', ref);
      }, error => {
        console.log('error', error);
      });
    },
    deleteTeam: function({}, {id}) {
      firestore.collection('teams').doc(id).delete().then(() => {
        console.log('deleted')
      }, error => {
        console.log('error', error)
      })

    },
    generateSchedule: function({ state, commit }) {
      console.log('generateSchedule', state)

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
      }

      let schedule = {};

      const slotCount = state.timeslots.length;
      for (let date of state.dates) {
        schedule[date] = {};

        // get a list of keys
        let ids = Object.keys(state.teams);
        shuffleArray(ids);

        // randomize starting location, incase the number of teams
        // is not evenly divisible
        let slotIndex = Math.floor(Math.random() * slotCount);
        // console.log(date, 'slot', slotIndex)

        for (let id of ids) {
          let timeslot = state.timeslots[slotIndex];
          // console.log('---', id, slotIndex, timeslot)

          if (!schedule[date][timeslot])
            schedule[date][timeslot] = [];
          schedule[date][timeslot].push(id);

          slotIndex = (slotIndex + 1) % slotCount;
        }

        // console.log('==================')
      }

      firestore.collection('schedules').doc('2018').set(schedule).then(ref => {
        console.log('success', ref);
      }, error => {
        console.log('error', error);
      });
    }
  }
});

// firestore.collection("teams").get().then((querySnapshot) => {
firestore.collection("teams").onSnapshot((querySnapshot) => {
  let teams = {};
  querySnapshot.forEach((doc) => {
      teams[doc.id] = doc.data();
  });

  store.commit('setTeams', teams);
});

firestore.collection("schedules").doc('2018').onSnapshot((snapshot) => {
  store.commit('setSchedule', snapshot.data());
});

firebase.auth().onAuthStateChanged(function(user) {
  console.log('xxxxxxxxxxxxxx')
  store.commit('setUser', user);
});
