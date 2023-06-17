import { ConnectedComponent } from 'compSystem/ConnectedComponent';
import { Button } from 'comp/button';
import { transformers } from 'compSystem/transformers';

import styles from './App.scss';

export class App extends ConnectedComponent {
  localState = transformers.observable({
    data1: '',
    data2: '',
  });

  handleGetData1 = () => {
    const { api } = this.context;

    void api.getData().then((response) => {
      transformers.batch(() => {
        this.localState.data1 = response.data;
      });
    });
  };

  handleGetData2 = () => {
    const { api } = this.context;

    void api
      .getDataWithReqParams({
        email: '',
      })
      .then((response) => {
        transformers.batch(() => {
          this.localState.data2 = response.data2;
        });
      });
  };

  render() {
    const { api } = this.context;

    return (
      <div className={styles.app}>
        <div className={styles.block}>
          <Button
            type={'grey'}
            className={styles.button}
            onClick={this.handleGetData1}
            isLoading={api.getData.state.isExecuting}
          >
            Request
          </Button>

          <div className={styles.content}>Result: {this.localState.data1}</div>
        </div>
      </div>
    );
  }
}
