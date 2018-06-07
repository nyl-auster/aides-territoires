import React, { Component } from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ApolloProvider } from "react-apollo";
import apolloClient from "./lib/apolloClient";
import store from "./store";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import HomePage from "./components/homepage/Homepage";
import SearchByTerritoirePage from "./components/search/SearchByTerritoirePage";
import SearchAidePage from "./components/search/SearchAidePage";
import AdminAideCreatePage from "./components/admin/AdminAideCreatePage";
import AdminAideEditPage from "./components/admin/AdminAideEditPage";
import AdminAideListPage from "./components/admin/AdminAideListPage";

class App extends React.PureComponent {
  render() {
    return (
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <BrowserRouter>
            <MuiThemeProvider>
              <div className="App">
                <Switch>
                  <Route exact path="/" component={HomePage} />
                  <Route
                    exact
                    path="/recherche"
                    component={SearchByTerritoirePage}
                  />
                  <Route exact path="/aides" component={SearchAidePage} />
                  <Route exact path="/admin" component={AdminAideListPage} />
                  <Route
                    exact
                    path="/aide/create"
                    component={AdminAideCreatePage}
                  />
                  <Route
                    exact
                    path="/aide/list"
                    component={AdminAideListPage}
                  />
                  <Route
                    exact
                    path="/aide/:id/edit"
                    component={AdminAideEditPage}
                  />
                  <Route component={() => <div>Oups ! Page non trouvée</div>} />
                </Switch>
              </div>
            </MuiThemeProvider>
          </BrowserRouter>
        </Provider>
      </ApolloProvider>
    );
  }
}

export default App;
