<h6>{message}</h6>

<form on:submit={submitHandler}>
    Login

    <input type="text" placeholder="Login" bind:value={login}>
    <input type="password" placeholder="Password" bind:value={password}>

    <input type="submit" value="Submit">
</form>

<script>
   import {signIn} from '../services/Api'

   let message = ''

   let login = ''
   let password = ''

   const submitHandler = async event => {
      event.preventDefault()

      try {
         message = await signIn(login, password)
      } catch (e) {}
   }
</script>