

export const Schedule = {
  data: function() {
    return {
      timeslots: ['13:00', '14:00', '15:00'],
      dates: [
        'Sep 24', 'Oct 01', 'Oct 08', 'Oct 15', 'Oct 22',
        'Oct 29', 'Nov 05', 'Nov 12', 'Nov 19', 'Nov 26']
    };
  },
  computed: Vuex.mapState(['schedule', 'teams']),
  methods: {
    getTeam: function(id) {
      return this.teams[id] || {};
    }
  },
  template: `
<table style="border: 4px solid black;">
<thead>
  <tr>
    <th></th>
    <th v-for="timeslot in timeslots">{{timeslot}}</th>
  </tr>
</thead>
<tbody>
  <tr v-for="date in dates">
    <td>{{date}}</td>
    <td v-for="timeslot in timeslots">
      <ul>
        <li v-for="team in schedule[date][timeslot]">
          <ol>
            <li>{{ getTeam(team).member_1 }}</li>
            <li>{{ getTeam(team).member_2 }}</li>
          </ol>
        </li>
      </ul>
    </td>
  </tr>
</tbody>
</table>
`
};
