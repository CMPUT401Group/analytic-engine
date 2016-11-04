
x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
time <- do.call(rbind,input[1])[,2] #this is only the timestamps
n <- input[[2]] # 2nd argument (number of stdev to use)
stdev <- sd(x)
med <- median(x)
y <- list() # list of values which are at least n dev from median
out <- list()

for (i in x) {
	if (abs(i-med)>stdev*n){
		y <- c(y,i)
	}
}
ind <- which(x %in% y) #indices of relevent elements

for (i in 1:length(input[[1]])) {
	if (i %in% ind){
		out <- c(out,time[i])
	}
}
print(out)



#for (i in 1:10) {
#	y <- c(y,i)
#}
#print(y)