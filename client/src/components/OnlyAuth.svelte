<button on:click={clickHandler}>Click to see only auth users data</button>
<button on:click={logout}>logout</button>
{data}

<script>
   import {authRequest, logout} from '../services/Api'

   let data = ''

   const clickHandler = async () => {
      const res = await authRequest('/needAuth')
      data = res.message
   }
</script>