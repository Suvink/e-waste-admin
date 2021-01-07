<template>
  <div class="container has-text-centered dashbody pb-2">
    <div class="container">
      <section class="hero is-primary mt-2">
        <div class="hero-body">
          <div class="container">
            <h1 class="title">
              Admin Dashboard
            </h1>
            <h2 class="subtitle">Welcome {{ this.userdata.fname }}</h2>
          </div>
        </div>
      </section>

      <section class="mt-2">
        <h1 class="title is-4 mb-2">Overview</h1>
        <div class="columns">
          <div class="column is-4">
            <div class="card pl-1 pr-1 pt-1 pb-1">
              <h1 class="title is-3">Collectors</h1>
              <h1 class="subtitle is-2">{{ this.overview.collectors }}</h1>
            </div>
          </div>
          <div class="column is-4">
            <div class="card pl-1 pr-1 pt-1 pb-1">
              <h1 class="title is-3">Clients</h1>
              <h1 class="subtitle is-2">{{ this.overview.clients }}</h1>
            </div>
          </div>
          <div class="column is-4">
            <div class="card pl-1 pr-1 pt-1 pb-1">
              <h1 class="title is-3">Jobs</h1>
              <h1 class="subtitle is-2">{{ this.overview.jobs }}</h1>
            </div>
          </div>
        </div>
      </section>

      <section class="mt-2">
        <div class="columns">
          <div class="column is-1"></div>
          <div class="column is-5">
            <h1 class="title is-5 mb-2">Current Jobs</h1>
            <bar-chart
              :data="[
                ['Ongoing', this.jobscharts.ongoing],
                ['Completed', this.jobscharts.completed],
                ['Cancelled', this.jobscharts.cancelled],
              ]"
              :colors="['#03a9f4', '#03a9f4']"
              download="Current Jobs"
            ></bar-chart>
          </div>
          <div class="column is-5">
            <h1 class="title is-5 mb-2">All Time Jobs</h1>
            <bar-chart
              :data="[
                ['Ongoing', 32],
                ['Completed', 12],
                ['Cancelled', 2],
              ]"
            ></bar-chart>
          </div>
          <div class="column is-1"></div>
        </div>
      </section>

      <section class="mt-2">
        <h1 class="title is-4 mb-2">Jobs History</h1>
        <div class="columns">
          <div class="column is-1"></div>
          <div class="column is-10">
            <line-chart
              :data="this.jobsWithDateString"
              download="Jobs History"
              :colors="['#9c27b0', '#03a9f4']"
            ></line-chart>
          </div>
          <div class="column is-1"></div>
        </div>
      </section>

      <section class="mt-2">
        <h1 class="title is-4 mb-2">Item Count</h1>
        <div class="columns">
          <div class="column is-1"></div>
          <div class="column is-10">
            <column-chart
              :data="[
                ['Mobile Phone', this.items.phone],
                ['TV', this.items.tv],
                ['Tablets', this.items.tab],
                ['Refrigerators', this.items.ref],
                ['Sports and Leisure Equipments', this.items.sports],
                ['Laptops', this.items.laptop],
                ['Other', this.items.other]
              ]"
              :colors="['#008000', '#03a9f4']"
              download="Count by Items"
            ></column-chart>
          </div>
          <div class="column is-1"></div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { firebaseApp, firebase } from "../firebase";

export default {
  name: "Dashboard",
  data() {
    return {
      jobslist: [],
      userdata: {},
      notify: false,
      notifyStatus: "",
      ongoingjob: {},
      userid: "",
      jobscharts: {
        ongoing: 0,
        completed: 0,
        cancelled: 0,
      },
      jobsWithDate: {},
      jobsWithDateString: "{}",
      overview: {
        clients: 0,
        collectors: 0,
        jobs: 0,
      },
      items: {
        phone: 0,
        tv: 0,
        tab: 0,
        ref: 0,
        sports: 0,
        laptop: 0,
        other: 0
      }
    };
  },
  created() {
    let thisState = this;
    let loggedUserEmail = firebaseApp.auth().currentUser.email;
  },

  mounted() {
    let thisState = this;
    firebaseApp
      .firestore()
      .collection("jobs")
      .onSnapshot(
        (callback) => {
          thisState.jobslist = [];
          thisState.overview.jobs = callback.size;
          callback.forEach(function(doc) {
            //Append document ID into job object
            let tempData = doc.data();
            tempData = Object.assign(tempData, { ref: doc.id.toString() });
            thisState.jobslist.push(tempData);
          });

          //console.log(this.jobslist);
          for (let i = 0; i < thisState.jobslist.length; i++) {
            if (thisState.jobslist[i].itemCategory == "Mobile Phones") {
              thisState.items.phone++;
            }else if (thisState.jobslist[i].itemCategory == "TV") {
              thisState.items.tv++;
            }else if (thisState.jobslist[i].itemCategory == "Tablets") {
              thisState.items.tab++;
            }
            else if (thisState.jobslist[i].itemCategory == "Refrigerators") {
              thisState.items.ref++;
            }
            else if (thisState.jobslist[i].itemCategory == "Sports and Leisure Equipments") {
              thisState.items.sports++;
            }
            else if (thisState.jobslist[i].itemCategory == "Laptops") {
              thisState.items.laptop++;
            }else{
              thisState.items.other++;
            }
          }

          for (let i = 0; i < thisState.jobslist.length; i++) {
            if (thisState.jobslist[i].status == "completed") {
              thisState.jobscharts.completed++;
            } else if (thisState.jobslist[i].status == "cancelled") {
              thisState.jobscharts.cancelled++;
            } else if (thisState.jobslist[i].status == "ongoing") {
              thisState.jobscharts.ongoing++;
            }
          }

          for (let i = 0; i < thisState.jobslist.length; i++) {
            let selectedDate = thisState.jobslist[i].date.toString();
            if (selectedDate in thisState.jobsWithDate) {
              thisState.jobsWithDate[selectedDate] =
                thisState.jobsWithDate[selectedDate] + 1;
            } else {
              thisState.jobsWithDate[selectedDate] = 1;
            }
          }
          this.jobsWithDateString = this.jobsWithDate;
        },
        (error) => {
          console.log(error);
        }
      );

    firebaseApp
      .firestore()
      .collection("users")
      .onSnapshot((callback) => {
        thisState.overview.clients = callback.size;
      });

    firebaseApp
      .firestore()
      .collection("collectors")
      .onSnapshot((callback) => {
        thisState.overview.collectors = callback.size;
      });

    //console.log(this.jobslist);
  },
  methods: {},
};
</script>

<style scoped>
@import url("../assets/css/style.css");

.dashbody {
  height: 200vh !important;
}

/* Pulse Grow */
@-webkit-keyframes hvr-pulse-grow {
  to {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
@keyframes hvr-pulse-grow {
  to {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
}
.hvr-pulse-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
}
.hvr-pulse-grow:hover,
.hvr-pulse-grow:focus,
.hvr-pulse-grow:active {
  -webkit-animation-name: hvr-pulse-grow;
  animation-name: hvr-pulse-grow;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-timing-function: linear;
  animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
  animation-direction: alternate;
}
</style>
