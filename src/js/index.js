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
    addTaskShow: Boolean, // 是否展開
  },
  computed: {
    // 上傳時間與現在時間的相對時間
    relativeTime() {
      return !this.task.lastUploadedDate ? '' : moment(this.task.lastUploadedDate).fromNow();
    },
  },
  methods: {
    editCancel() {
      // Cancel 按鈕事件 會回復資料 以及 將 Vee 驗證重置
      this.$emit('edit-cancel');
      this.$validator.reset();
    },
    editSave() {
      // Save 按鈕事件 儲存這一筆資料
      this.$emit('edit-save');
    },
    taskRemove() {
      // icon trash 按鈕事件 刪除這一筆資料
      this.$emit('edit-remove', this.task.taskId);
    },
    fileChange(e) {
      // 檔案 change 時 填入檔案名稱及現在時間
      this.task.file = e.target.files[0].name;
      this.task.lastUploadedDate = moment().format();
    },
  },
  watch: {
    // checkbox 是否完成切換
    'task.done': function(value) {
      this.$emit('done-change', this.task.taskId, value);
    },
    // 星星圖按鈕 重要程度切換
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
      lastUploadedDate: '',
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
      //   lastUploadedDate: '2018-02-10T00:02:55+08:00',
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
      //   lastUploadedDate: '2018-05-02T00:02:55+08:00',
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
      //   lastUploadedDate: '2018-06-08T00:02:55+08:00',
      //   comment: '要先找到東東',
      //   important: true,
      //   done: false,
      // },
    ],

    originalTasks: [

    ],
  },
  computed: {
    // 依照重要程度排序
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
    // 篩選 未完成
    inProgressTasks() {
      return this.tasks.filter(task => !task.done);
    },
    // 篩選 已完成
    completedTasks() {
      return this.tasks.filter(task => task.done);
    },
    // 回復最初狀態用資料 依照重要程度排序
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
    // 回復最初狀態用資料 未完成
    originalInProgressTasks() {
      return this.originalTasks.filter(task => !task.done);
    },
    // 回復最初狀態用資料 已完成
    originalCompletedTasks() {
      return this.originalTasks.filter(task => task.done);
    },
    // 上傳時間與現在時間的相對時間
    relativeTime() {
      return !this.task.lastUploadedDate ? '' : moment(this.task.lastUploadedDate).fromNow();
    },
    // 完成筆數
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
    // 回復資料 以及 關閉展開視窗
    editCancel(task, originalTask) {
      if (originalTask) {
        Object.keys(task).forEach((key) => {
          task[key] = originalTask[key];
        });
      }

      task.editTaskShow = false;
    },
    // 儲存資料 更新 originalTask 關閉展開視窗
    editSave(task, originalTask) {
      if (task) {
        Object.keys(originalTask).forEach((key) => {
          originalTask[key] = task[key];
        });
      }

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      
      task.editTaskShow = false;
    },
    // 刪除資料 刪除 originalTask
    editRemove(id) {
      const taskIndex = vm.tasks.findIndex(task => task.taskId === id);
      vm.tasks.splice(taskIndex, 1);

      const originalTaskIndex = vm.originalTasks.findIndex(task => task.taskId === id);
      vm.originalTasks.splice(originalTaskIndex, 1);

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    // 是否完成切換
    doneChange(id, value) {
      const task = vm.originalTasks.find(task => task.taskId === id);
      task.done = value;

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    // 重要程度切換
    importantChange(id, value) {
      const task = vm.originalTasks.find(task => task.taskId === id);
      task.important = value;

      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    },
    // 檔案 change 時 填入檔案名稱及現在時間
    fileChange(e) {
      this.task.file = e.target.files[0].name;
      this.task.lastUploadedDate = moment().format();
    },
  },
  created() {
    // 取得 localStorage.getItem('tasks') 全部資料
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
      this.tasks = this.tasks.concat(tasks);
    }

    // 複製一份還原備用
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
