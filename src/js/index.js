new Vue({
  el: '#todoListMain',
  data: {
    tab: 'MyTasks',
    addTaskShow: false,
    editTaskShow: false,

    taskId: uuidv4(),
    title: '',
    deadline: '',
    file: '',
    comment: '',
    importanat: '',
    status,
    
    tasks: [
      {
        taskId: uuidv4(),
        title: '代辦事項第一項',
        deadline: '2018/05/05',
        file: 'file01',
        comment: '註解?',
        importanat: '',
        status,
      },
    ],
  },
});
