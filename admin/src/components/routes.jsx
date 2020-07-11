import React, { useContext } from 'react'
import { Switch, Redirect, Route } from 'react-router-dom';
import login from "../pages/login";
import register from "../pages/register";
import dashboard from "../pages/dashboard";
import reports from "../pages/reports";
import { AuthContext } from "../data/auth";


const Routes = () => {

    const { currentUser } = useContext(AuthContext);

    if (currentUser) {
        return (    
            <Switch>
                <Route path='/dashboard' component={dashboard} />
                <Route path='/reports' component={reports} />
                <Redirect to='/dashboard' />
            </Switch>
        )
    } else {     
        return (    
            <Switch>
                <Route path='/login' component={login} />
                <Route path='/register' component={register} />
                <Redirect to='/login' />
            </Switch>
        )
    }

    

}
export default Routes;