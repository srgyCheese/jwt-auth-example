<div>
    {#if !$isAuthorized}
        <RegisterForm />
        <LoginForm />
    {:else}
        <OnlyAuth />
    {/if}
</div>

<script>
   import LoginForm from './components/LoginForm.svelte'
   import RegisterForm from './components/RegisterForm.svelte'
   import OnlyAuth from './components/OnlyAuth.svelte'
   import {isAuthorized} from './services/Api'
</script>