import sevenBin from '7zip-bin';
import Seven from 'node-7z';
import fixPath from 'fix-path';
const archivePath = '_mon_.7z';
const pathTo7zip = sevenBin.path7za;

fixPath();
Seven.extract(archivePath, 'export', {
    $progress: true,
    recursive: true,
    $bin: pathTo7zip,
    password: "momo",
    noArchiveOnFail: true,
    techInfo: true,
})
