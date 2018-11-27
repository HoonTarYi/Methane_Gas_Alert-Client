import React from 'react';

// removed data-dismiss="alert"  from button so that
// onClick will handle it's close

 const DeletedMessage = props => {
  if (props.show) {
    return (
      <div class="alert alert-success show alert-dismissible" role="alert">
        All data deleted
        <button
          type="button"
          class="close"
          aria-label="Close"
           onClick={props.alertDismiss}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  } else {
    return null;
  }
};
 export default DeletedMessage;
