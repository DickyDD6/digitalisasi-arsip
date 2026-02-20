<!DOCTYPE html>
<html>

<head>
    <title>Laporan Digital Archive</title>
    <style>
        body {
            font-family: sans-serif;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .section {
            margin-bottom: 30px;
        }

        h2 {
            border-bottom: 2px solid #ddd;
            padding-bottom: 5px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th,
        td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>

<body>
    <div class="header">
        <h1>Laporan Digital Archive</h1>
        <p>Periode: {{ $data['period']['range'] }}</p>
    </div>

    @if(isset($data['doc_status']))
        <div class="section">
            <h2>Status Dokumen Overview</h2>
            <table>
                <thead>
                    <tr>
                        <th>Status</th>
                        <th>Jumlah</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data['doc_status'] as $status)
                        <tr>
                            <td>{{ $status['label'] }}</td>
                            <td>{{ $status['count'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if(isset($data['upload_stats']))
        <div class="section">
            <h2>Statistik Upload</h2>
            <table>
                <thead>
                    <tr>
                        <th>Tanggal</th>
                        <th>Jumlah Upload</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data['upload_stats'] as $stat)
                        <tr>
                            <td>{{ $stat->date }}</td>
                            <td>{{ $stat->count }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    @if(isset($data['user_activity']))
        <div class="section">
            <h2>Aktivitas User Teratas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nama User</th>
                        <th>Jumlah Aktivitas</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($data['user_activity'] as $user)
                        <tr>
                            <td>{{ $user['user_name'] }}</td>
                            <td>{{ $user['activity_count'] }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif

    <div class="section">
        <h2>Executive Summary</h2>
        <p>Total Dokumen: {{ $data['executive_summary']['total_documents'] }}</p>
        <p>Dokumen Menunggu Verifikasi: {{ $data['executive_summary']['pending_documents'] }}</p>
    </div>
</body>

</html>