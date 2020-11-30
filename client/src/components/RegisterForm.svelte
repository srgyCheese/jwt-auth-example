<h6>{message}</h6>

<form on:submit={submitHandler}>
    Register

    <input type="text" placeholder="Login" bind:value={login}>
    <input type="password" placeholder="Password" bind:value={password}>

    <input type="submit" value="Submit">
</form>

<script>
   import {signUp} from '../services/Api'

   let message = ''

   let login = ''
   let password = ''

   const submitHandler = async event => {
      event.preventDefault()

      message = await signUp(login, password)
   }
</script>