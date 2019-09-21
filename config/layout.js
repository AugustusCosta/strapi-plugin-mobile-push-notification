module.exports = {
  notification: {
    actions: {
      create: 'Notification.create', // Use the Notification plugin's controller.
      update: 'Notification.update',
      destroy: 'Notification.destroy',
      deleteall: 'Notification.destroyAll',
    },
    attributes: {
      title: {
        className: 'col-md-6'
      },
      subtitle: {
        className: 'col-md-6'
      },
      body: {
        className: 'col-md-6'
      },
      priority: {
        className: 'col-md-6'
      },
      sendDate: {
        className: 'col-md-6'
      },
      data: {
        className: 'col-md-6'
      },
      pending: {
        className: 'd-none'
      }
    }
  }
};
