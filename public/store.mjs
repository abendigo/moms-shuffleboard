
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
firestore.settings(settings);

export const store = new Vuex.Store({
  state: {
    timeslots: ['1.00 p.m', '1.45 p.m', '2.30'],
    dates: [
      'Jan. 10th', 'Jan. 24th', 'Jan. 31st', 'Feb. 7th', 'Feb. 14th', 'Feb. 21st',
      'Feb. 28th', 'Mar. 7th', 'Mar. 14th', 'Mar. 28th', 'April 4th'
    ],

    teams: [],
    schedule: {
      'Sep 24': {'13:00': [], '13:45': [], '14:30': []},
      'Oct 01': {'13:00': [], '13:45': [], '14:30': []},
      'Oct 08': {'13:00': [], '13:45': [], '14:30': []},
      'Oct 15': {'13:00': [], '13:45': [], '14:30': []},
      'Oct 22': {'13:00': [], '13:45': [], '14:30': []},
      'Oct 29': {'13:00': [], '13:45': [], '14:30': []},
      'Nov 05': {'13:00': [], '13:45': [], '14:30': []},
      'Nov 12': {'13:00': [], '13:45': [], '14:30': []},
      'Nov 19': {'13:00': [], '13:45': [], '14:30': []},
      'Nov 26': {'13:00': [], '13:45': [], '14:30': []}
    },

    user: undefined
  },
  mutations: {
    addDate(state, date) {
      let xxx = [...state.dates];
      xxx.push(date);
      Vue.set(state, 'dates', xxx);
    },
    deleteDate(state, date) {
      let xxx = [...state.dates];
      xxx.splice(xxx.indexOf(date), 1);
      Vue.set(state, 'dates', xxx);
    },
    addTimeslot(state, timeslot) {
      let xxx = [...state.timeslots];
      xxx.push(timeslot);
      Vue.set(state, 'timeslots', xxx);
    },
    deleteTimeslot(state, timeslot) {
      let xxx = [...state.timeslots];
      xxx.splice(xxx.indexOf(timeslot), 1);
      Vue.set(state, 'timeslots', xxx);
    },
    setTeams(state, teams) { state.teams = teams; },
    setSchedule(state, schedule) {
      console.log('schedule', schedule)
      // state.timeslots = Object.keys(schedule[Object.keys(schedule)[0]]);
      // state.dates = Object.keys(schedule).sort((a, b) => {
      //   console.log('sort', a, b, moment(a).format(), moment(b).format());
      //   return -1;
      // });
      state.schedule = schedule;
    },
    setUser(state, user) { state.user = user; }
  },
  actions: {
    addDate: function({commit}, {form}) {
      console.log('addDate', form.member_1)
      commit('addDate', form.member_1);
    },
    addTimeslot: function({commit}, {form}) {
      commit('addTimeslot', form.member_1);
    },
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
    deleteDate: function({commit}, {date}) {
      commit('deleteDate', date);
    },
    deleteTimeslot: function({commit}, {timeslot}) {
      commit('deleteTimeslot', timeslot);
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
