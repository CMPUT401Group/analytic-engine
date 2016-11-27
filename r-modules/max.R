 #this returns the time of the local max in a dataset. 

x <- do.call(rbind,input[1])[,1] #this gets the first element of each nested list 
y <- do.call(rbind,input[1])[,2]

max <- which.max(x)

return(y[max])
