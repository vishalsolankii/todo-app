import React from 'react';

class Login extends React.Component {

   constructor(){
      super()
      this.state = {
         name: 'vishal',
         email: 'vishal@gmail.com'
      }

      this.updateState = this.updateState.bind(this);
   

   }

  updateState(e){

   const name = e.target.name;
   this.setState({[name]:e.target.value});
  } 
  
 
   render() {
      return (
         <div>
         	<form action="" method="post">
            <lebal>user name</lebal><input type = "text" name="name" value={this.state.name}
            onChange = {this.updateState}/>
            {this.state.name}<br/><br/>            <lebal>password</lebal><input type = "email" name="email" value={this.state.email} onChange={this.updateState}/>
            {this.state.email}<br/><br/>
            <input type="submit" name="submit" value="submit"/><br/><br/><br/><br/>
        
            </form>
         </div>
      );
   }
}
export default Login;