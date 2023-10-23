export default function ({ $auth, redirect }) {
  let nama = $auth.user.role.nama
  nama = nama === 'superadmin' ? 'admin' : nama
  if (nama !== 'admin') {
    return redirect('/')
  }
}
