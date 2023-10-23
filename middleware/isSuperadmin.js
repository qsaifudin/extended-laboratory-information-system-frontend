export default function ({ $auth, redirect }) {
  console.log($auth.user.role.nama)
  if ($auth.user.role.nama !== 'superadmin') {
    return redirect('/')
  }
}
