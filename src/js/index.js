Vue.use(VeeValidate, {
  locale: 'zh_TW',
});

Vue.component('edit-tasks', {
  template: '#edittasks',
  data() {
    return {
      
    };
  },
  props: {
    task: Object,
    addTaskShow: Boolean,
  },
  methods: {
    editCancel() {
      this.$emit('edit-save');
      // this.task.editTaskShow = !this.task.editTaskShow;
      this.$validator.reset();
    },
    editSave() {
      this.$emit('edit-save');
    },
  },
  watch: {
    'task.done': function(value) {
      this.$emit('done-change', this.task.taskId, value);
    },
    'task.important': function(value) {
      // horseTODO: 不知道為什麼這個 watch 會觸發到兩次 上面的就正常 一定要找到原因解決這種情況
      this.$emit('important-change', this.task.taskId, value);
    },
  },
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
      important: false,
      done: false,
    },
    
    tasks: [
      // {
      //   editTaskShow: false,

      //   taskId: uuidv4(),
      //   title: '吃飯',
      //   deadline: '2018/06/05',
      //   deadlineTime: '01:00',
      //   file: 'file01',
      //   comment: '要先煮飯',
      //   important: false,
      //   done: true,
      // },
      // {
      //   editTaskShow: false,

      //   taskId: uuidv4(),
      //   title: '睡覺',
      //   deadline: '2018/06/07',
      //   deadlineTime: '',
      //   file: 'file01',
      //   comment: '要先閉眼睛',
      //   important: true,
      //   done: false,
      // },
      // {
      //   editTaskShow: false,

      //   taskId: uuidv4(),
      //   title: '打東東',
      //   deadline: '2018/06/07',
      //   deadlineTime: '',
      //   file: 'file01',
      //   comment: '要先找到東東',
      //   important: true,
      //   done: false,
      // },
    ],

    originalTasks: [

    ],
  },
  computed: {
    sortedImpotantTasks() {
      const compare = (a) => {
        if (a.important) {
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

    originalSortedImpotantTasks() {
      const compare = (a) => {
        if (a.important) {
          return -1;
        } else {
          return 1;
        }
      };
      return this.originalTasks.sort(compare);
    },
    originalInProgressTasks() {
      return this.originalTasks.filter(task => !task.done);
    },
    originalCompletedTasks() {
      return this.originalTasks.filter(task => task.done);
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

            flatpickr('.flatpickrTime', {
              enableTime: true,
              noCalendar: true,
              allowInput: true,
              dateFormat: 'H:i',
            });
          });

          this.originalTasks = _.cloneDeep(this.tasks);

          localStorage.setItem('tasks', JSON.stringify(this.tasks));
        }
      });
    },
    editSave(task, originalTask) {
      if (originalTask) {
        Object.keys(task).forEach((key) => {
          task[key] = originalTask[key];
        });
      } else {
        this.originalTasks = _.cloneDeep(this.tasks);

        localStorage.setItem('tasks', JSON.stringify(this.tasks));
      }
      task.editTaskShow = false;
    },

    doneChange(id, value) {
      const task = vm.originalTasks.find(task => task.taskId === id);
      task.done = value;

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    importantChange(id, value) {
      const task = vm.originalTasks.find(task => task.taskId === id);
      task.important = value;

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
  },
  created() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      this.tasks = this.tasks.concat(tasks);
    }

    this.originalTasks = _.cloneDeep(this.tasks);
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
});
