import os, gzip

fname = 'GRCh38_three_prime_utrs.fa.gz'
dname = 'three_prime_utrs_fastas'

f = gzip.open(fname,'rb')
if not os.path.isdir(dname): os.mkdir(dname)
os.chdir(dname)


line = f.readline()
while line.startswith(b'>'):
	newfname = (line.split(b'|',1)[0][1:] + b'.fa').decode()

	if newfname.startswith('NM_'):
		newf = open(newfname,'wb')
		newf.write(line)
	buf = []

	for line in f:
		if line.startswith(b'>'):
			break
		else:
			buf.append(line.lower().strip())

	if newfname.startswith('NM_'):
		with open('temp.seq','wb') as tempf:
			tempf.writelines(buf)
		with open('temp.seq','rb') as tempf:
			while True:
				line60 = tempf.read(60).strip()
				if line60:
					newf.write(line60); newf.write(b'\n')
				else:
					break
		#newf.writelines(buf)
		newf.close()
		print(newfname)
	else:
		print(newfname,end=' SKIPPED\n')

f.close()
os.remove('temp.seq')
