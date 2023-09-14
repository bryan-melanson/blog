<template>
  <div v-if="resume">
    <div class="container">
      <div class="name-label">
        <h1>{{ resume.basics.name }}</h1>
        <h5>{{ resume.basics.label.toUpperCase() }}</h5>
      </div>
      <div class="med-column">
        <div class="contact-profiles">
          <h3>CONTACT &amp; PROFILES</h3>
          <div class="contact"><a :href="'mailto:' + resume.basics.email">{{ resume.basics.email }}</a></div>
          <div class="contact">{{ resume.basics.phone }}</div>
          <div class="contact">
            <a :href="resume.basics.website" target="_blank">{{ resume.basics.website }}</a>
          </div>
          <div v-for="(profile, index) in resume.basics.profiles" :key="index">
            <div class="contact">
              <a :href="profile.url" target="_blank" style="display: inline-flex; align-items: center;">
                {{ profile.username }}
                <div class="social-icon">
                  <Icon :type="profile.network" />
                </div>
              </a>
            </div>
          </div>
        </div>
        <div class="summary">
          <h3>SUMMARY</h3>
          <p>{{ resume.basics.summary }}</p>
        </div>
        <div>
          <div class="education" v-if="!isEmpty(resume.education)" style="margin-top: 0.5em;">
            <h3 style="margin-bottom: 0.5em;">EDUCATION</h3>
            <div v-for="(educationItem, index) in resume.education" :key="index" style="position: relative;">
              <h3 style="margin-bottom: 0;">{{ educationItem.institution }}</h3>
              <h5><a :href="educationItem.website">{{ educationItem.website }}</a></h5>
              <h5 style="margin: 2px 0; margin-top: 5px; display: flex;">
                <span> {{ educationItem.startDate }} - {{ educationItem.endDate }} </span>
              </h5>
              <p>
                <span>{{ educationItem.area }}</span><br>
                <span> {{ educationItem.studyType }}</span>
              </p>
              <div v-for="(course, index) in educationItem.courses" :key="index" style="position: relative;">
                <li>{{ course }}</li>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="med-column">
        <div>
          <h3>SKILLS</h3>
          <div v-for="(item, k) in resume.skills" :key="k">
            <div>
              <p><strong>{{ item.name }}</strong></p>
            </div>
            <div class="item-list">
              <Tag :color="'secondary'" v-for="(tag, k) in item.keywords" :key="k" class="item">{{ tag }}</Tag><br>
            </div>
          </div>
        </div>
        <div v-if="!isEmpty(resume.languages)" class="languages">
          <h3>LANGUAGES</h3>
          <div style="margin-top: 10px">
            <div v-for="(item, k) in resume.languages" class="item-list" :key="k">
              <span>{{ item.language }}</span>
              <Tag :color="'secondary'" class="item">{{ item.fluency }}</Tag>
            </div>
          </div>
        </div>
        <div v-if="!isEmpty(resume.interests)" class="interests">
          <h3>INTERESTS &amp; HOBBIES</h3>
          <div style="margin-top: 10px">
            <div v-for="(item, k) in resume.interests" :key="k">
              <span>{{ item.name }}</span>
              <div class="item-list">
                <Tag :color="'secondary'" v-for="(tag, k) in item.keywords" class="item" :key="k">{{ tag }}</Tag>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="large-column">

        <!-- WORK EXPERIENCE (Rendered Inline) -->
        <div v-if="!isEmpty(resume.work)" style="margin-top: 0.5em;">
          <h3 style="margin-bottom: 0.5em;">WORK EXPERIENCE</h3>
          <div v-for="(workItem, index) in resume.work" :key="index" style="position: relative;">
            <h3 style="margin-bottom: 0;">{{ workItem.position }}</h3>
            <h5 style="margin: 2px 0; display: flex; justify-content: space-between;">
              <strong>{{ workItem.company || workItem.organization
              }}</strong>
              <a :href="workItem.website" target="_blank">{{ workItem.website }}</a>
            </h5>
            <h5> {{ workItem.startDate }} to {{ workItem.endDate }} </h5>
            <p>{{ workItem.summary }}</p>
            <div v-for="(highlight, index) in workItem.highlights" :key="index" style="position: relative;">
              <li>{{ highlight }}</li>
            </div>
          </div>
        </div>
        <!-- VOLUNTEER EXPERIENCE (Rendered Inline) -->
        <div v-if="!isEmpty(resume.volunteer)" style="margin-top: 0.5em;">
          <h3 style="margin-bottom: 0.5em;">VOLUNTEER EXPERIENCE</h3>
          <div v-for="(volunteerItem, index) in resume.volunteer" :key="index" style="position: relative;">
            <h3 style="margin-bottom: 0;">{{ volunteerItem.position }}</h3>
            <h5 style="margin: 2px 0; display: flex; justify-content: space-between;">
              <strong>{{ volunteerItem.company ||
                volunteerItem.organization
              }}</strong>
              <a :href="volunteerItem.website" target="_blank">{{ volunteerItem.website }}</a>
            </h5>
            <h5>{{ volunteerItem.startDate }} to {{ volunteerItem.endDate }}</h5>
            <p>{{ volunteerItem.summary }}</p>
            <div v-for="(highlight, index) in volunteerItem.highlights" :key="index" style="position: relative;">
              <li>{{ highlight }}</li>
            </div>
            <p>{{ volunteerItem.hightlights }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import Tag from './Tag.vue';
import Icon from './Icon.vue';

export default {
  name: 'Resume',
  props: {
    style: Object,
  },
  components: {
    Tag, // Register the Tag component for use in this component
    Icon
  },
  data() {
    return {
      resume: null,
    };
  },
  methods: {
    isEmpty(array) {
      return !array || array.length === 0;
    },
  },
  async created() {
    // Fetch the JSON Resume data from the file
    try {
      const response = await fetch("https://gist.githubusercontent.com/bryan-melanson/e4843ee863be3e76063a5b88e977daf1/raw/b8bac89498ef2b34b89ff80897335755da2b90a2/resume.json");
      if (response.ok) {
        this.resume = await response.json();
      } else {
        console.error('Failed to fetch JSON Resume data');
      }
    } catch (error) {
      console.error('An error occurred while fetching JSON Resume data:', error);
    }
  },
};
</script>

<style scoped>
.name-label {
  grid-column: 1 / span 6;
  background-color: #333;
  color: #fff;
  padding: 20px;
}

.large-column {
  padding: 10px;
  grid-column: span 3;
}

.med-column {
  padding: 10px;
  grid-column: span 2;
  overflow-x: auto;
}

@media (max-width: 768px) {
  .med-column {
    padding: 10px;
    grid-column: span 3;
  }
}

.med-column {
  padding: 10px;
  grid-column: span 2;
}

.small-column {
  padding: 10px;
  grid-column: span 1;
}

.contact {
  margin-top: 5px;
}

.social-icon {
  fill: gray;
  margin-left: 5px;
}

.item-list {
  display: flex;
  flex-wrap: wrap;
}

.items {
  max-width: 300px;
  overflow: visible;
}

.item {
  margin-right: 5px;
  margin-bottom: 5px;
}

.container {
  display: grid;
  grid-template-columns: 3fr 3fr 3fr;
  grid-gap: 20px;
}

@media (max-width: 768px) {
  .container {
    display: block;
    width: 100%;
    overflow-x: auto;
  }
}

li {
  margin-left: 10px;
  margin-bottom: 5px;
}

.link {
  text-decoration: underline;
}

.small-caps {
  font-variant: small-caps;
}
</style>

