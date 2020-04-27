'use strict'

const Job = use('App/Models/Job')

class JobController {
    async home({ view }) {


        // Fetch a job
        const jobs = await Job.all();

        return view.render('index', { jobs: jobs.toJSON() })
    }
    async userIndex({ view, auth }) {

        // Fetch all user's jobs
        const jobs = await auth.user.jobs().fetch();
        console.log(jobs)

        return view.render('jobs', { jobs: jobs.toJSON() })
    }

    async create({ request, response, session, auth }) {
        const job = request.all();

        const posted = await auth.user.jobs().create({
            title: job.title,
            link: job.link,
            description: job.description,
            job_url: job.job_url
        });

        session.flash({ message: 'Your job has been posted!' });
        return response.redirect('back');
    }

    async delete({ response, session, params }) {
        const job = await Job.find(params.id);
        await job.delete();
        session.flash({ message: 'Your job has been removed' });
        return response.redirect('/post-a-job');
    }

    async edit({ params, view }) {
        const job = await Job.find(params.id);
        return view.render('edit', { job: job });
    }

    async update({ response, request, session, params }) {
        const job = await Job.find(params.id);

        job.title = request.all().title;
        job.link = request.all().link;
        job.description = request.all().description;

        await job.save();

        session.flash({ message: 'Your job has been updated. ' });
        return response.redirect('/post-a-job');
    }

    async view({ params, view, auth, session }) {
        const jobid = await Job.find(params.id);
        let jobdata = await Job.findBy("id", params.id);
        console.log(jobdata);
        if (jobdata === null) {
            // Fetch all user's jobs
            const jobs = await auth.user.jobs().fetch();
            console.log(jobs)
            session.flash({ message: 'No job found. Post one. ' });
            return view.render('jobs', { jobs: jobs.toJSON() })
        } else {
            return view.render('view', { job: jobdata.toJSON() })
        }
    }
}

module.exports = JobController
