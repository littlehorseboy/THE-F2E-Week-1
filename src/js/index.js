Vue.use(VeeValidate, {
  locale: 'zh_TW',
});

Vue.component('edit-tasks', {
  template: '#edittasks',
  data() {
    return {
      editTaskShow: false,
    };
  },
  props: {
    task: Object,
    addTaskShow: Boolean,
  },
  methods: {
    editSave() {

    },
  }
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
      deadlineTime: '',
      file: '',
      comment: '',
      importanat: false,
      done: false,
    },
    
    tasks: [
      {
        taskId: uuidv4(),
        title: '吃飯',
        deadline: '2018/06/05',
        deadlineTime: '01:00',
        file: 'file01',
        comment: '要先煮飯',
        importanat: false,
        done: true,
      },
      {
        taskId: uuidv4(),
        title: '睡覺',
        deadline: '2018/06/07',
        deadlineTime: '',
        file: 'file01',
        comment: '要先閉眼睛',
        importanat: true,
        done: false,
      },
      {
        taskId: uuidv4(),
        title: '打東東',
        deadline: '2018/06/07',
        deadlineTime: '',
        file: 'file01',
        comment: '要先找到東東',
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
    inProgressTasks() {
      return this.tasks.filter(task => !task.done);
    },
    completedTasks() {
      return this.tasks.filter(task => task.done);
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

          // 重置所有值
          Object.keys(this.task).forEach((key) => {
            if (key.indexOf('Id') !== -1) {
              this.task[key] = uuidv4();
            } else {
              this.task[key] = '';
            }
          });
          this.$validator.reset();
          this.addTaskShow = false;

          this.$nextTick(() => {
            flatpickr('.flatpickr', {
              // enableTime: true,
              allowInput: true,
              dateFormat: 'Y/m/d',
              locale: 'zh',
            });

          });
        }
      });
    },
  },
  mounted() {
    flatpickr('.flatpickr', {
      // enableTime: true,
      allowInput: true,
      dateFormat: 'Y/m/d',
      locale: 'zh',
    });

    flatpickr('.flatpickrTime', {
      enableTime: true,
      noCalendar: true,
      allowInput: true,
      dateFormat: 'H:i',
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
    // tab() {
    //   debugger;
    //   this.$nextTick(() => {
    //     flatpickr('.flatpickr', {
    //       enableTime: true,
    //       locale: 'zh',
    //     });
    //   });
    // },
  },
});
