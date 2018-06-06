Vue.use(VeeValidate, {
  locale: 'zh_TW',
});

const vm = new Vue({
  el: '#todoListMain',
  data: {
    tab: 'MyTasks',
    addTaskShow: false,

    task: {
      taskId: uuidv4(),
      title: '',
      deadline: '',
      file: '',
      comment: '',
      importanat: false,
      done: false,
    },
    
    tasks: [
      {
        editTaskShow: false,

        taskId: uuidv4(),
        title: '代辦事項第一項',
        deadline: '2018-06-05',
        file: 'file01',
        comment: '註解?',
        importanat: false,
        done: true,
      },
      {
        editTaskShow: false,

        taskId: uuidv4(),
        title: '代辦事項第二項',
        deadline: '2018-06-07',
        file: 'file01',
        comment: '註解?',
        importanat: true,
        done: false,
      },
    ],
  },
  computed: {
    sortedImpotantTasks() {
      const compare = (a) => {
        if (a.importanat) {
          return -1;
        } else {
          return 1;
        }
      };
      return this.tasks.sort(compare);
    },
    doneTaskCount() {
      return this.tasks.filter(task => !task.done).length;
    },
  },
  methods: {
    addTask() {
      this.$validator.validateAll().then((result) => {
        if (result) {
          const task = _.cloneDeep(this.task);
          task.editTaskShow = false;
          this.tasks.push(task);
          Object.keys(this.task).forEach((key) => {
            if (key.indexOf('Id') !== -1) {
              this.task[key] = uuidv4();
            } else {
              this.task[key] = '';
            }
          });
          this.$validator.reset();
          this.addTaskShow = false;

          return;
        }
      });
    },
    editSave() {

    },
  },
  mounted() {
    flatpickr('.flatpickr', {
      enableTime: true,
      locale: 'zh',
    });
  },
  watch: {
    addTaskShow(value) {
      if (value === true) {
        this.$nextTick(() => {
          this.$refs.title.focus();
        });
      }
    },
  },
});
