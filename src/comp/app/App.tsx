import { ConnectedComponent } from 'compSystem/ConnectedComponent';
import { Button } from 'comp/button';
import { transformers } from 'compSystem/transformers';
import { TypeApiRequest } from 'models';

import styles from './App.scss';

export class App extends ConnectedComponent {
  localState = transformers.observable({
    data1: '',
    data2: '',
    error1: '',
  });

  handleGetDataSuccess = () => {
    const { api } = this.context;

    void api.getData().then((response) => {
      transformers.batch(() => {
        this.localState.data1 = response.data;
      });
    });
  };

  handleGetDataMocked = () => {
    const { api } = this.context;

    transformers.batch(() => {
      api.getDataWithReqParams.state.mock = {
        data: 'Mocked data',
      };
    });

    // Another way to type request params
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const requestParams: TypeApiRequest<'getDataWithReqParams'> = { email: '' };

    void api.getDataWithReqParams({ email: '' }).then((response) => {
      transformers.batch(() => {
        this.localState.data2 = response.data;
      });
    });
  };

  handleGetDataError = () => {
    const { api } = this.context;

    void api.getDataError().catch((error) => {
      transformers.batch(() => {
        this.localState.error1 = error.message;
      });
    });
  };

  handleGetDataErrorAnotherWay = () => {
    const { api } = this.context;

    void api.getDataError().catch(() => false);
  };

  render() {
    const { api } = this.context;

    return (
      <div className={styles.app}>
        <div className={styles.block}>
          <Button
            type={'grey'}
            className={styles.button}
            onClick={this.handleGetDataSuccess}
            isLoading={api.getData.state.isExecuting}
          >
            Request
          </Button>

          <div className={styles.content}>Result: {this.localState.data1}</div>
        </div>
        <div className={styles.block}>
          <Button
            type={'grey'}
            className={styles.button}
            onClick={this.handleGetDataMocked}
            isLoading={api.getDataWithReqParams.state.isExecuting}
          >
            Request (mocked)
          </Button>

          <div className={styles.content}>Result: {this.localState.data2}</div>
        </div>
        <div className={styles.block}>
          <Button
            type={'grey'}
            className={styles.button}
            onClick={this.handleGetDataError}
            isLoading={api.getDataError.state.isExecuting}
          >
            Request (error)
          </Button>

          <div className={styles.content}>Error: {this.localState.error1}</div>
        </div>
        <div className={styles.block}>
          <Button
            type={'grey'}
            className={styles.button}
            onClick={this.handleGetDataErrorAnotherWay}
            isLoading={api.getDataError.state.isExecuting}
          >
            Request (error from state)
          </Button>

          <div className={styles.content}>Error: {api.getDataError.state.error}</div>
        </div>
      </div>
    );
  }
}
